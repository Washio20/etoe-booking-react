import { NextResponse } from "next/server";
import { getSession, getAccessToken } from "@auth0/nextjs-auth0";
import { cookies } from "next/headers";

// 添加动态路由配置
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 验证用户是否已登录
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const user_id = session.user.sub;

    try {
      // 获取管理API访问令牌
      const { accessToken } = await getAccessToken();

      // 调用Auth0管理API获取用户元数据
      const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
        /^https?:\/\//,
        ""
      );

      // 首先尝试使用read:users权限获取用户详情
      const response = await fetch(
        `https://${auth0Domain}/api/v2/users/${user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("Successfully retrieved user metadata using read:users");
        return NextResponse.json({
          user_metadata: userData.user_metadata || {},
          source: "management_api",
        });
      }

      // 如果失败，尝试使用read:current_user权限
      const errorData = await response.json();
      console.log("Auth0 API error with read:users:", errorData);

      if (
        response.status === 403 &&
        errorData.errorCode === "insufficient_scope"
      ) {
        console.log("Trying to use read:current_user permission");

        // 尝试使用/userinfo端点获取用户信息
        const userInfoResponse = await fetch(
          `https://${auth0Domain}/userinfo`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          console.log(
            "Successfully retrieved user info using read:current_user"
          );
          if (userInfo.user_metadata) {
            return NextResponse.json({
              user_metadata: userInfo.user_metadata,
              source: "userinfo",
            });
          }
        } else {
          console.log(
            "Failed to get user info:",
            await userInfoResponse.text()
          );
        }
      }

      // 尝试从session中获取元数据
      if (session.user.user_metadata) {
        console.log("Using metadata from session");
        return NextResponse.json({
          user_metadata: session.user.user_metadata,
          source: "session",
        });
      }

      // 尝试使用cookie作为最后的回退
      const cookieStore = cookies();
      const userMetadataCookie = cookieStore.get("user_metadata");

      if (userMetadataCookie) {
        try {
          const cookieData = JSON.parse(userMetadataCookie.value);
          console.log("Using metadata from cookie");
          return NextResponse.json({
            user_metadata: cookieData,
            source: "cookie",
          });
        } catch (parseError) {
          console.error("Error parsing cookie data:", parseError);
        }
      }

      // 返回错误
      return NextResponse.json(
        {
          error: "ユーザー情報の取得に失敗しました。",
          details: errorData,
        },
        { status: response.status }
      );
    } catch (apiError) {
      console.error("Auth0 API request error:", apiError);
      return NextResponse.json(
        { error: "APIリクエストエラーが発生しました。" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching user metadata:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
