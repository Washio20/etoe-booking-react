import { NextResponse } from "next/server";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  return res;
});

// 指定哪些路径需要保护
export const config = {
  matcher: [
    "/reservations/:path*",
    "/member/:path*",
    "/passcode/:path*",
    "/reservation/confirm/:path*",
    "/reservation-complete/:path*",
  ],
};
