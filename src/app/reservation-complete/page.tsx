"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { useUser } from "@auth0/nextjs-auth0/client";

function ReservationCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setError("支払いセッションが見つかりません。");
        setIsVerifying(false);
        return;
      }

      // 最大重试次数和间隔
      const maxRetries = 5;
      const retryInterval = 2000; // 2秒
      let retryCount = 0;

      const attemptVerification = async (): Promise<boolean> => {
        try {
          const response = await fetch(
            `/api/verify-payment?session_id=${sessionId}`
          );
          const data = await response.json();

          if (response.ok && data.success) {
            // 支付验证成功
            localStorage.removeItem("reservationInfo");
            return true;
          }

          // 如果是支付未完成的错误，我们继续重试
          if (data.error === "支払いが完了していません") {
            return false;
          }

          // 其他错误（如认证错误）直接抛出
          throw new Error(data.error || "支払い確認に失敗しました。");
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "支払いが完了していません"
          ) {
            return false;
          }
          throw error;
        }
      };

      const runWithRetry = async () => {
        try {
          while (retryCount < maxRetries) {
            const success = await attemptVerification();
            if (success) {
              setIsVerifying(false);
              return;
            }

            // 如果验证失败但还可以重试
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(
                `支払い確認を再試行中... (${retryCount}/${maxRetries})`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, retryInterval)
              );
            }
          }

          // 如果所有重试都失败
          setError(
            "支払い確認がタイムアウトしました。予約一覧で状態をご確認ください。"
          );
        } catch (error) {
          console.error("Error verifying payment:", error);
          setError(
            error instanceof Error
              ? error.message
              : "支払い確認中にエラーが発生しました。"
          );
        } finally {
          setIsVerifying(false);
        }
      };

      runWithRetry();
    };

    if (!isLoading && user) {
      verifyPayment();
    }
  }, [isLoading, user, searchParams]);

  if (isLoading || isVerifying) {
    return (
      <Layout>
        <div className="max-w-[920px] mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-gray-600">支払い状態を確認中...</p>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-[920px] mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <p className="text-gray-600 text-sm">
              支払い処理は正常に完了している可能性があります。
              <br />
              予約一覧ページで状態をご確認ください。
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push("/reservations")}
                className="px-6 py-2 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-800"
              >
                予約一覧を確認
              </button>
              <br />
              <button
                onClick={() => router.push("/reservation/confirm")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
              >
                予約画面に戻る
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[920px] mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <h1 className="text-2xl font-bold text-gray-700">
            ご予約ありがとうございます
          </h1>
          <p className="text-gray-700">
            予約が完了しました。
            <br />
            予約内容は予約一覧ページでご確認いただけます。
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push("/reservations")}
              className="px-6 py-2 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-800"
            >
              予約一覧を確認
            </button>
            <br />
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded-full text-sm hover:bg-gray-700"
            >
              トップページに戻る
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ReservationComplete() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="max-w-[920px] mx-auto px-4 py-12">
            <div className="text-center space-y-4">
              <p className="text-gray-600">読み込み中...</p>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <ReservationCompleteContent />
    </Suspense>
  );
}
