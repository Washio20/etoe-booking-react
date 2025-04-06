"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Layout from "@/components/Layout";

export default function PasscodePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [checkInDate, setCheckInDate] = useState("--/--/-- --:--");
  const [checkOutDate, setCheckOutDate] = useState("--/--/-- --:--");
  const [roomNumber, setRoomNumber] = useState("---");

  // 在组件挂载时检查预约信息
  useEffect(() => {
    if (!user) return;

    // 获取预约信息
    const reservationInfo = localStorage.getItem("reservationInfo");
    if (reservationInfo) {
      try {
        const parsedInfo = JSON.parse(reservationInfo);
        // 假设有预约日期和时间信息
        if (parsedInfo.selectedDate && parsedInfo.selectedTime) {
          const date = new Date(parsedInfo.selectedDate);
          const formattedDate = `${date.getFullYear().toString().slice(2)}/${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
          setCheckInDate(`${formattedDate} ${parsedInfo.selectedTime}`);

          // 假设每次预约时长为1小时
          const checkoutDate = new Date(date);
          const [hours, minutes] = parsedInfo.selectedTime
            .split(":")
            .map(Number);
          checkoutDate.setHours(hours + 1);
          const formattedCheckoutDate = `${checkoutDate
            .getFullYear()
            .toString()
            .slice(2)}/${(checkoutDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${checkoutDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;
          setCheckOutDate(
            `${formattedCheckoutDate} ${checkoutDate.getHours()}:${minutes
              .toString()
              .padStart(2, "0")}`
          );

          // 设置房间号码（根据房间类型）
          switch (parsedInfo.selectedRoomType) {
            case "tototo":
              setRoomNumber("101");
              break;
            case "fuuu":
              setRoomNumber("201");
              break;
            case "zabuun":
              setRoomNumber("301");
              break;
            case "toron":
              setRoomNumber("401");
              break;
            case "sauna_suite":
              setRoomNumber("501");
              break;
            case "slow_room":
              setRoomNumber("601");
              break;
            default:
              setRoomNumber("---");
          }
        }
      } catch (error) {
        console.error("予約情報の解析エラー", error);
      }
    }
  }, [user]);

  // 处理加载状态
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-[#444444] font-zen-kaku-gothic">読み込み中...</p>
        </div>
      </Layout>
    );
  }

  // 处理未登录状态
  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-[#444444] font-zen-kaku-gothic">
            入室パスコードを表示するには、ログインしてください。
          </p>
          <a
            href="/api/auth/login"
            className="px-6 py-2 bg-[#444444] text-white rounded-full text-sm tracking-wide font-zen-kaku-gothic hover:bg-[#333333] transition-colors"
          >
            ログイン
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#FAF9F7] pt-4 pb-6">
        <div className="max-w-md mx-auto py-4">
          <div className="border-b border-[rgba(68,68,68,0.2)] pb-4 mb-6">
            <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              入室用パスコード
            </h1>
          </div>

          {/* カード本体 */}
          <div className="bg-[#CCBBAC] rounded-lg overflow-hidden relative">
            {/* ロゴエリア */}
            <div className="p-4 flex justify-between items-center bg-[#CCBBAC]">
              <Image
                src="/images/logo.svg"
                alt="naNA SAUNA AND HOTEL"
                width={120}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
              <div className="flex flex-col items-end">
                <div className="text-white text-[10px] font-medium tracking-wider">
                  部屋番号
                </div>
                <div className="text-white text-[21px] font-bold">
                  {roomNumber}
                </div>
              </div>
            </div>

            {/* 区切り線 */}
            <div className="relative">
              <div className="border-t border-dashed border-[#E5DBD3]"></div>
              {/* 左端の半円 */}
              <div className="absolute w-3 h-3 bg-white rounded-full left-[-6px] top-[-6px]"></div>
              {/* 右端の半円 */}
              <div className="absolute w-3 h-3 bg-white rounded-full right-[-6px] top-[-6px]"></div>
            </div>

            {/* ユーザー情報 */}
            <div className="p-8 flex flex-col items-center">
              <div className="w-full mb-6">
                <div className="text-white text-sm font-bold tracking-wider mb-2">
                  {user.name} 様
                </div>
                <div className="border-b border-white border-opacity-80"></div>
              </div>

              {/* バーコード */}
              <div className="mb-6">
                <Image
                  src="/images/barcode.png"
                  alt="Barcode"
                  width={220}
                  height={220}
                  className="rounded"
                />
              </div>

              {/* 案内文 */}
              <p className="text-white text-xs leading-relaxed tracking-wider text-center mb-8">
                バーコードをリーダーにかざすか、
                <br />
                スマホをリーダーにタッチして入室ください。
              </p>

              {/* 予約情報 */}
              <div className="w-full relative">
                <div className="relative">
                  <div className="border-t border-dashed border-[#E5DBD3]"></div>
                </div>

                {/* 中央の縦線 - 上部虚線からスタート */}
                <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2">
                  <div className="h-full border-l border-dashed border-[#E5DBD3]"></div>
                </div>

                {/* チェックイン・チェックアウト情報を横に並べる */}
                <div className="flex justify-between mt-4">
                  {/* チェックイン */}
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-medium tracking-wide">
                      チェックイン日時
                    </span>
                    <span className="text-white text-lg font-bold">
                      {checkInDate}
                    </span>
                  </div>

                  {/* チェックアウト */}
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-medium tracking-wide">
                      チェックアウト日時
                    </span>
                    <span className="text-white text-lg font-bold">
                      {checkOutDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-800"
            >
              トップページに戻る
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
