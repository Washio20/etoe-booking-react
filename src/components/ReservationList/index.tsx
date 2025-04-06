"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface Reservation {
  id: string;
  date: string;
  time: string;
  type: string;
  room: string;
  plan: string;
  price: number;
  imageUrl: string;
  status: "current" | "past";
}

export default function ReservationList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptName, setReceiptName] = useState("");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 确保只在客户端渲染模态框
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 模拟预约数据
  const reservations: Reservation[] = [
    {
      id: "1",
      date: "2024年1月1日",
      time: "20:00〜22:00",
      type: "サウナ",
      room: "ROOM naNA",
      plan: "なし",
      price: 5000,
      imageUrl: "/images/room.png",
      status: "current",
    },
    {
      id: "2",
      date: "2024年1月1日",
      time: "20:00〜22:00",
      type: "サウナ",
      room: "ROOM naNA",
      plan: "なし",
      price: 5000,
      imageUrl: "/images/room.png",
      status: "past",
    },
    // 可以添加更多预约数据
  ];

  const filteredReservations = reservations.filter(
    (reservation) => reservation.status === activeTab
  );

  const handleOpenReceiptModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReceiptModalOpen(true);
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptName("");
    setSelectedReservation(null);
  };

  const handleIssueReceipt = () => {
    if (!receiptName.trim()) return;
    // TODO: 实现收据生成逻辑
    console.log(
      "Issuing receipt for:",
      selectedReservation,
      "Name:",
      receiptName
    );
    handleCloseReceiptModal();
  };

  const handleOpenCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedReservation(null);
  };

  const handleCancelReservation = () => {
    if (!selectedReservation) return;
    // TODO: 实现取消预约的逻辑
    console.log("Cancelling reservation:", selectedReservation);
    handleCloseCancelModal();
    // 跳转到取消完成页面
    router.push("/reservations/cancel/complete");
  };

  // 渲染收据模态框
  const renderReceiptModal = () => {
    if (!isMounted || !isReceiptModalOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="bg-white rounded-lg p-12 w-[90%] max-w-[920px] relative mx-auto my-4 max-h-[90vh] overflow-y-auto">
          <button
            onClick={handleCloseReceiptModal}
            className="absolute top-4 right-4 border border-white rounded-full px-3 py-1 text-[12px] tracking-[0.06em] font-zen-kaku-gothic flex items-center gap-2"
          >
            <span className="w-3 h-0.5 bg-[#444444] transform rotate-45 absolute"></span>
            <span className="w-3 h-0.5 bg-[#444444] transform -rotate-45 absolute"></span>
            <span className="ml-4">close</span>
          </button>

          <div className="space-y-8">
            <h2 className="text-[24px] font-bold text-center text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              領収書の発行
            </h2>

            <div className="border border-[#BBBBBB] rounded px-3 py-2">
              <input
                type="text"
                value={receiptName}
                onChange={(e) => setReceiptName(e.target.value)}
                placeholder="領収書の宛名を入力してください。"
                className="w-full text-[16px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic placeholder-[#444444] placeholder-opacity-50 outline-none"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleIssueReceipt}
                className="px-4 py-2 bg-[#444444] text-white rounded-full text-[14px] tracking-[0.06em] font-zen-kaku-gothic"
              >
                領収書を発行する
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // 渲染取消预约模态框
  const renderCancelModal = () => {
    if (!isMounted || !isCancelModalOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div className="bg-white rounded-lg p-8 md:p-12 w-[90%] max-w-[920px] mx-auto my-4 max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
              <h2 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                予約キャンセル
              </h2>
            </div>

            <p className="text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              以下の予約をキャンセルします。
            </p>

            <div className="bg-white rounded-lg p-4 md:p-8 space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="w-32 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    予約日時
                  </span>
                  <span className="flex-1 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {selectedReservation?.date} {selectedReservation?.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    予約種別
                  </span>
                  <span className="flex-1 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {selectedReservation?.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    お部屋
                  </span>
                  <span className="flex-1 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {selectedReservation?.room}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    セットプラン
                  </span>
                  <span className="flex-1 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {selectedReservation?.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    利用料金
                  </span>
                  <span className="flex-1 text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {selectedReservation?.price.toLocaleString()}円
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-end gap-4 border-t border-[#BBBBBB] pt-4">
                <span className="text-[15px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                  キャンセル料
                </span>
                <div className="flex items-baseline">
                  <span className="text-[24px] font-bold text-[#E51D1D] tracking-[0.06em] font-zen-kaku-gothic">
                    {Math.floor(
                      (selectedReservation?.price || 0) * 0.3
                    ).toLocaleString()}
                  </span>
                  <span className="text-[15px] font-bold text-[#E51D1D] tracking-[0.06em] font-zen-kaku-gothic ml-1">
                    円
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              お支払い済みのご利用料金からキャンセル料を差し引いた金額が返金されます。
              <br />
              <a href="#" className="underline">
                キャンセルポリシーはこちら
              </a>
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleCloseCancelModal}
                className="px-8 py-2 bg-[#999999] text-white rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic"
              >
                戻る
              </button>
              <button
                onClick={handleCancelReservation}
                className="px-8 py-2 bg-[#444444] text-white rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic"
              >
                キャンセルする
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
        <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          予約一覧
        </h1>
      </div>

      <div className="flex gap-4">
        <button
          className={`px-6 py-2 rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic ${
            activeTab === "current"
              ? "bg-[#F0EAE4] border border-[#444444]"
              : "bg-white border border-[#444444]"
          }`}
          onClick={() => setActiveTab("current")}
        >
          予約中
        </button>
        <button
          className={`px-6 py-2 rounded-full text-[16px] tracking-[0.06em] font-zen-kaku-gothic ${
            activeTab === "past"
              ? "bg-[#F0EAE4] border border-[#444444]"
              : "bg-white border border-[#444444]"
          }`}
          onClick={() => setActiveTab("past")}
        >
          過去の予約
        </button>
      </div>

      <div className="space-y-8">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="flex items-start gap-8">
            <div className="w-[240px] h-[180px] relative rounded overflow-hidden">
              <Image
                src={reservation.imageUrl}
                alt="Room"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-lg p-8 space-y-2">
                <div className="flex justify-between">
                  <span className="w-32 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    予約日時
                  </span>
                  <span className="flex-1 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {reservation.date} {reservation.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    予約種別
                  </span>
                  <span className="flex-1 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {reservation.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    お部屋
                  </span>
                  <span className="flex-1 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {reservation.room}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    セットプラン
                  </span>
                  <span className="flex-1 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {reservation.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-32 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    利用料金
                  </span>
                  <span className="flex-1 text-[13px] text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                    {reservation.price.toLocaleString()}円
                  </span>
                </div>
              </div>
              {reservation.status === "current" ? (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleOpenReceiptModal(reservation)}
                    className="px-4 py-2 bg-[#444444] text-white rounded-full text-[12px] tracking-[0.06em] font-zen-kaku-gothic"
                  >
                    領収書の発行
                  </button>
                  <button
                    onClick={() => handleOpenCancelModal(reservation)}
                    className="px-4 py-2 bg-[#444444] text-white rounded-full text-[12px] tracking-[0.06em] font-zen-kaku-gothic"
                  >
                    予約キャンセル
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button className="px-2 py-1 bg-[#BBBBBB] text-white rounded-full text-[10px] tracking-[0.06em] font-zen-kaku-gothic">
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 使用渲染函数代替内联JSX */}
      {renderReceiptModal()}
      {renderCancelModal()}
    </div>
  );
}
