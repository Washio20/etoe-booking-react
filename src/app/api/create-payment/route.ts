import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import Stripe from "stripe";

// 初始化Stripe客户端
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  try {
    // 获取Auth0会话
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 检查用户邮箱是否已验证
    if (session.user.email_verified === false) {
      return NextResponse.json(
        { error: "メールアドレスの確認が必要です" },
        { status: 403 }
      );
    }

    // 解析请求体获取预约信息
    const reservation = await req.json();

    // 使用前端传递的金额，如果没有传递才使用默认计算方式
    let amount = reservation.amount;

    // 如果没有提供金额，则根据房间类型计算（兼容旧代码）
    if (!amount) {
      console.warn("No amount provided, calculating based on room type");

      switch (reservation.room) {
        case "TOTOTO":
          amount = 3000;
          break;
        case "FUUU":
          amount = 3500;
          break;
        case "ZABUUN":
          amount = 4000;
          break;
        case "TORON":
          amount = 4500;
          break;
        case "サウナスイート":
          amount = 6000;
          break;
        case "スロールーム":
          amount = 5000;
          break;
        default:
          amount = 3000;
      }

      // 如果有スロールーム计划，添加额外费用
      if (reservation.plan.includes("スロールーム")) {
        amount += 2000;
      }
    }

    console.log(`创建支付会话，金额: ${amount}円`);

    // 创建Stripe支付会话
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `${reservation.room} - ${reservation.date} ${reservation.time}`,
              description: `予約日時: ${reservation.date} ${reservation.time}\nプラン: ${reservation.plan}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.AUTH0_BASE_URL}/reservation-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.AUTH0_BASE_URL}/reservation/confirm`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.sub,
        reservationDate: reservation.date,
        reservationTime: reservation.time,
        roomType: reservation.room,
        plan: reservation.plan,
        price: String(amount), // 添加价格到metadata
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("支払いセッションの作成中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "支払いセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
