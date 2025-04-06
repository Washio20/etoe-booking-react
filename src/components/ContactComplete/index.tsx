"use client";

import { useRouter } from "next/navigation";

export default function ContactComplete() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
        <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          お問い合わせ完了
        </h1>
      </div>

      <div className="space-y-6">
        <p className="text-[15px] text-[#444444] tracking-[0.06em] leading-[1.65] font-zen-kaku-gothic whitespace-pre-line">
          {`お問い合わせいただきありがとうございました。
順次内容を確認し、担当者よりお返事いたしますので
今しばらくお待ちくださいませ。
なお、内容によってはお返事差し上げられない場合がございますので
あらかじめご了承くださいませ。`}
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/reservations")}
            className="px-12 py-4 bg-[#444444] text-white rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic"
          >
            予約一覧へ
          </button>
        </div>
      </div>
    </div>
  );
}
