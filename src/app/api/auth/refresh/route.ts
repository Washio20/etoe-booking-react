import { NextResponse, NextRequest } from "next/server";
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const returnTo = url.searchParams.get("returnTo") || "/";

    // 构建一个带有returnTo参数的重定向URL，指向Auth0登录页面
    const loginUrl = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

    // 重定向到Auth0登录，这将刷新用户的会话
    return NextResponse.redirect(new URL(loginUrl, req.url));
  } catch (error) {
    console.error("Error in refresh route:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
