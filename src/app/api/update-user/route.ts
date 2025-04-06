import { NextResponse } from "next/server";
import { getSession, getAccessToken } from "@auth0/nextjs-auth0";

interface UserMetadata {
  phone?: string;
  birthdate?: string;
  gender?: string;
  fullName?: string;
}

export async function POST(req: Request) {
  try {
    // 验证用户是否已登录
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    // 获取请求数据
    const { user_id, user_metadata } = await req.json();

    // 验证用户是否在更新自己的信息
    if (user_id !== session.user.sub) {
      return NextResponse.json(
        { error: "他のユーザーの情報は更新できません。" },
        { status: 403 }
      );
    }

    try {
      // 获取管理API访问令牌
      const { accessToken } = await getAccessToken();

      // 调用Auth0管理API更新用户元数据
      const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
        /^https?:\/\//,
        ""
      );

      // 首先尝试使用update:users权限
      const response = await fetch(
        `https://${auth0Domain}/api/v2/users/${user_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_metadata: user_metadata as UserMetadata,
          }),
        }
      );

      if (response.ok) {
        return NextResponse.json({ success: true });
      }

      // 如果失败，检查是否是权限问题
      const errorData = await response.json();
      console.log("Auth0 API error:", errorData);

      if (
        response.status === 403 &&
        errorData.errorCode === "insufficient_scope"
      ) {
        // 尝试使用update:current_user_metadata权限
        console.log(
          "Trying to update with update:current_user_metadata permission"
        );

        const userMetadataResponse = await fetch(
          `https://${auth0Domain}/api/v2/users/${user_id}/metadata`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user_metadata as UserMetadata),
          }
        );

        if (userMetadataResponse.ok) {
          return NextResponse.json({ success: true });
        }

        // 如果第二种方式也失败，返回详细的错误信息
        const metadataError = await userMetadataResponse.json();
        console.error("Auth0 User Metadata API error:", metadataError);
        return NextResponse.json(
          {
            error: "ユーザー情報の更新に失敗しました。",
            details: metadataError,
          },
          { status: userMetadataResponse.status }
        );
      }

      // 返回初始错误
      return NextResponse.json(
        {
          error: "ユーザー情報の更新に失敗しました。",
          details: errorData,
        },
        { status: response.status }
      );
    } catch (apiError) {
      console.error("Auth0 API request error:", apiError);

      // 使用本地更新方式作为最后的回退方案
      try {
        // 注意：这种方式只是临时解决方案，不推荐用于生产环境
        // 它将用户元数据保存在cookie中，不是真正的Auth0用户元数据更新
        // 仅用于开发测试阶段

        console.log("Falling back to local cookie-based storage");
        const cookieValue = JSON.stringify(user_metadata);
        const response = NextResponse.json({
          success: true,
          warning: "使用临时存储方案，仅用于开发环境",
        });

        // 设置cookie保存用户元数据（临时方案）
        response.cookies.set("user_metadata", cookieValue, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30, // 30天
          path: "/",
        });

        return response;
      } catch (cookieError) {
        console.error("Cookie fallback error:", cookieError);
        return NextResponse.json(
          { error: "すべての保存方法に失敗しました。" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
