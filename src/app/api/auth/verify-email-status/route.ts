import { NextResponse } from "next/server";
import { getSession, getAccessToken } from "@auth0/nextjs-auth0";

// 添加动态路由配置
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 获取用户会话
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    try {
      // 获取管理API访问令牌
      const { accessToken } = await getAccessToken();

      // 从Auth0管理API获取最新的用户信息
      const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
        /^https?:\/\//,
        ""
      );
      const userId = session.user.sub;

      console.log(`Checking email verification status for user ${userId}`);

      const response = await fetch(
        `https://${auth0Domain}/api/v2/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to get user info:", await response.text());
        return NextResponse.json(
          { error: "ユーザー情報の取得に失敗しました。" },
          { status: response.status }
        );
      }

      // 解析用户信息
      const userData = await response.json();

      // 返回邮箱验证状态
      return NextResponse.json({
        email_verified: userData.email_verified || false,
        email: userData.email,
        // 在此添加一个重定向URL，当验证成功时可以使用
        redirect_url: "/reservation/confirm",
      });
    } catch (apiError) {
      console.error("Auth0 API request error:", apiError);
      return NextResponse.json(
        { error: "APIリクエストエラーが発生しました。" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
