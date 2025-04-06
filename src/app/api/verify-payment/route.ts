import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function GET(req: Request) {
  try {
    // 获取Auth0会话
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 获取URL参数
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "セッションIDが必要です" },
        { status: 400 }
      );
    }

    // 获取Stripe支付会话
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // 验证支付状态
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "支払いが完了していません" },
        { status: 400 }
      );
    }

    // 验证用户身份
    const customerId = checkoutSession.customer;
    const customerEmail = checkoutSession.customer_email;

    if (customerEmail !== session.user.email) {
      return NextResponse.json(
        { success: false, error: "ユーザー認証に失敗しました" },
        { status: 403 }
      );
    }

    // TODO: 在这里保存预约信息到数据库
    const metadata = checkoutSession.metadata;
    console.log("Reservation metadata:", metadata);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "支払い確認中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
