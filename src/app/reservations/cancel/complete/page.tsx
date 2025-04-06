"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function CancelCompletePage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-[920px] mx-auto py-12 space-y-12">
        <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
          <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
            予約キャンセル完了
          </h1>
        </div>

        <p className="text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          予約がキャンセルされました。
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => router.push("/reservations")}
            className="px-8 py-2 bg-[#444444] text-white rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic"
          >
            予約一覧へ
          </button>
        </div>
      </div>
    </Layout>
  );
}
