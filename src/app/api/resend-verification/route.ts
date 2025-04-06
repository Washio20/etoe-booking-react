import { NextResponse } from "next/server";
import { getSession, getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: Request) {
  try {
    // 验证用户是否已登录
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    // 确保仅当前用户可以为自己重新发送验证邮件
    const { email } = await req.json();
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: "他のユーザーのメール確認はできません。" },
        { status: 403 }
      );
    }

    // 检查用户邮箱是否已验证
    if (session.user.email_verified) {
      return NextResponse.json(
        { error: "メールアドレスは既に確認済みです。" },
        { status: 400 }
      );
    }

    try {
      // 获取管理API访问令牌
      const { accessToken } = await getAccessToken();

      // 调用Auth0管理API重新发送验证邮件
      const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(
        /^https?:\/\//,
        ""
      );

      // 尝试使用/api/v2/jobs/verification-email接口
      console.log("Trying to send verification email using management API...");
      const response = await fetch(
        `https://${auth0Domain}/api/v2/jobs/verification-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user.sub,
            client_id: process.env.AUTH0_CLIENT_ID,
          }),
        }
      );

      if (response.ok) {
        console.log(`Successfully sent verification email to ${email}`);
        return NextResponse.json({ success: true });
      }

      // 记录错误
      const errorData = await response.json();
      console.log("Auth0 API error with jobs/verification-email:", errorData);

      // 直接使用密码重置API发送邮件
      console.log("Trying to send password reset email...");
      const auth0ClientId = process.env.AUTH0_CLIENT_ID;
      const passwordResetResponse = await fetch(
        `https://${auth0Domain}/dbconnections/change_password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: auth0ClientId,
            email: email,
            connection: "Username-Password-Authentication", // 这是Auth0默认的数据库连接名称
          }),
        }
      );

      if (passwordResetResponse.ok) {
        console.log(`Successfully sent password reset email to ${email}`);
        return NextResponse.json({
          success: true,
          message:
            "パスワードリセット用のメールを送信しました。メールをご確認ください。",
        });
      }

      // 密码重置API请求失败
      let resetErrorData = "Unknown error";
      try {
        resetErrorData = await passwordResetResponse.text();
        console.error("Auth0 password reset API error:", resetErrorData);
      } catch (e) {
        console.error("Failed to parse password reset error:", e);
      }

      // 构建手动重置链接作为最后手段
      const passwordResetUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/dbconnections/change_password`;
      const returnTo = process.env.AUTH0_BASE_URL || "http://localhost:3000";

      // 返回带有直接链接的错误信息
      return NextResponse.json(
        {
          error:
            "メール送信に失敗しました。以下のリンクを使用してパスワードリセットを行ってください。",
          code: "email_delivery_failed",
          fallbackOptions: {
            resetPassword: true,
            message:
              "以下のリンクからパスワードリセットを行うことでメールアドレスの確認ができます。",
            resetPasswordUrl: `${passwordResetUrl}?client_id=${auth0ClientId}&email=${encodeURIComponent(
              email
            )}&returnTo=${encodeURIComponent(returnTo)}`,
          },
        },
        { status: 200 }
      );
    } catch (apiError) {
      console.error("Auth0 API request error:", apiError);
      return NextResponse.json(
        { error: "APIリクエストエラーが発生しました。" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// 添加动态路由配置
export const dynamic = "force-dynamic";
