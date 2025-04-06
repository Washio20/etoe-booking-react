"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { InfoIcon, X } from "lucide-react";
import { createPortal } from "react-dom";
import DateTimeSelection from "../DateTimeSelection";

type RoomType =
  | "tototo"
  | "fuuu"
  | "zabuun"
  | "toron"
  | "sauna_suite"
  | "slow_room";

type TabType = "private_sauna" | "sauna_suite" | "slow_room" | "";

interface PriceInfo {
  timeRange: string;
  price: string;
}

interface RoomInfo {
  id: RoomType;
  name: string;
  image: string;
  prices: PriceInfo[];
  duration: string;
  extension: string;
  description: string;
}

const rooms: RoomInfo[] = [
  {
    id: "tototo",
    name: "tototo",
    image: "/images/tototo-s.jpg",
    prices: [
      { timeRange: "平日の10:00-16:00", price: "¥16,800" },
      { timeRange: "平日の16:00-25:00", price: "¥18,800" },
      { timeRange: "土曜、日曜、祝日", price: "¥20,800" },
    ],
    duration: "1.5時間",
    extension: "不可",
    description: "定員4名/32㎡/15℃の水風呂付き",
  },
  {
    id: "fuuu",
    name: "fuuu",
    image: "/images/fuuu-s.jpg",
    prices: [
      { timeRange: "平日の10:00-16:00", price: "¥10,800" },
      { timeRange: "平日の16:00-25:00", price: "¥11,800" },
      { timeRange: "土曜、日曜、祝日", price: "¥12,800" },
    ],
    duration: "1.5時間",
    extension: "不可",
    description: "定員2名/18㎡/15℃の水風呂付き",
  },
  {
    id: "zabuun",
    name: "zabuun",
    image: "/images/zabuun-s.jpg",
    prices: [
      { timeRange: "平日の10:00-16:00", price: "¥10,800" },
      { timeRange: "平日の16:00-25:00", price: "¥11,800" },
      { timeRange: "土曜、日曜、祝日", price: "¥12,800" },
    ],
    duration: "1.5時間",
    extension: "不可",
    description: "定員2名/18㎡/15℃の水風呂付き",
  },
  {
    id: "toron",
    name: "toron",
    image: "/images/toron-s.jpg",
    prices: [
      { timeRange: "平日の10:00-16:00", price: "¥9,800" },
      { timeRange: "平日の16:00-25:00", price: "¥10,800" },
      { timeRange: "土曜、日曜、祝日", price: "¥11,800" },
    ],
    duration: "1.5時間",
    extension: "不可",
    description: "定員2名/15㎡/15℃の水風呂付き",
  },
  {
    id: "sauna_suite",
    name: "sauna suite",
    image: "/images/suite-s.jpg",
    prices: [
      { timeRange: "平日の16:00-25:00", price: "¥29,800" },
      { timeRange: "土曜、日曜、祝日", price: "¥32,800" },
      { timeRange: "宿泊A：15:00-翌10:00", price: "¥98,000" },
      { timeRange: "宿泊B：22:00-翌13:00", price: "¥49,800～¥54,800" },
    ],
    duration: "3時間",
    extension: "不可",
    description:
      "定員3名/40㎡/サウナ/バスタブ/大型製氷機/ルームシアター/バルコニー付き",
  },
  {
    id: "slow_room",
    name: "slow room",
    image: "/images/slow-room-s.jpg",
    prices: [
      { timeRange: "平日の10:00-16:00", price: "¥6,900" },
      { timeRange: "平日の16:00-25:00", price: "¥7,900" },
      { timeRange: "土曜、日曜、祝日", price: "¥8,900" },
      { timeRange: "宿泊A：15:00-翌10:00", price: "¥37,000" },
      { timeRange: "宿泊B：22:00-翌13:00", price: "¥21,000" },
    ],
    duration: "2時間",
    extension: "30分/¥2,000円",
    description: "定員2名/17㎡/ルームシアター/シャワー",
  },
];

interface RoomInfoModalProps {
  room: RoomInfo | null;
  onClose: () => void;
}

function RoomInfoModal({ room, onClose }: RoomInfoModalProps) {
  if (!room) return null;

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-auto my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-[#444444]" />
          </button>
        </div>
        <div className="px-4 sm:px-8">
          <div className="relative w-full h-[220px] sm:h-[320px] mb-4">
            <Image
              src={room.image.replace("-s.jpg", ".jpeg")}
              alt={room.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <table className="w-full border-collapse mb-8">
            <tbody>
              <tr className="border-b border-[rgba(68,68,68,0.2)]">
                <td className="py-4 w-[30%] text-[#444444] font-zen-kaku-gothic">
                  利用時間
                </td>
                <td className="py-4 w-[70%] text-[#444444] font-zen-kaku-gothic">
                  {room.duration}
                </td>
              </tr>
              <tr className="border-b border-[rgba(68,68,68,0.2)]">
                <td className="py-4 text-[#444444] font-zen-kaku-gothic">
                  価格
                </td>
                <td className="py-4 w-[70%] text-[#444444] font-zen-kaku-gothic">
                  <div className="space-y-2">
                    {room.prices.map((priceInfo, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{priceInfo.timeRange}</span>
                        <span className="font-medium">{priceInfo.price}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-[rgba(68,68,68,0.2)]">
                <td className="py-4 text-[#444444] font-zen-kaku-gothic">
                  延長料金
                </td>
                <td className="py-4 text-[#444444] font-zen-kaku-gothic">
                  {room.extension}
                </td>
              </tr>
              <tr className="border-b border-[rgba(68,68,68,0.2)]">
                <td className="py-4 text-[#444444] font-zen-kaku-gothic">
                  説明
                </td>
                <td className="py-4 text-[#444444] font-zen-kaku-gothic">
                  {room.description}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center mb-2">
            <button
              onClick={onClose}
              className="px-12 py-3 bg-[#444444] text-white rounded-md hover:bg-[#333333] transition-colors font-zen-kaku-gothic"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function RoomSelection() {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | "">("");
  const [selectedTab, setSelectedTab] = useState<TabType>("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState<RoomInfo | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInfoClick = (roomId: RoomType, e: React.MouseEvent) => {
    e.stopPropagation();
    const roomInfo = rooms.find((room) => room.id === roomId) || null;
    setSelectedRoomInfo(roomInfo);
    setShowInfoModal(true);
  };

  // 根据当前选中的tab筛选要显示的房间
  const filteredRooms = rooms.filter((room) => {
    if (!selectedTab) return false;

    switch (selectedTab) {
      case "private_sauna":
        return ["tototo", "fuuu", "zabuun", "toron"].includes(room.id);
      case "sauna_suite":
        return room.id === "sauna_suite";
      case "slow_room":
        return room.id === "slow_room";
      default:
        return false;
    }
  });

  // 处理房间选择
  const handleRoomSelection = useCallback((roomId: RoomType) => {
    setSelectedRoom(roomId);
  }, []);

  // 处理选项卡切换
  const handleTabChange = useCallback((tabId: TabType) => {
    setSelectedTab(tabId);
    setSelectedRoom(""); // 当切换选项卡时，清除选中的房间
  }, []);

  return (
    <div className="space-y-12">
      <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
        <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          部屋を選んでください
        </h1>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-4">
        {[
          { id: "private_sauna", label: "プライベートサウナ" },
          { id: "sauna_suite", label: "サウナスイート" },
          { id: "slow_room", label: "スロールーム" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`flex-1 py-3 px-6 rounded-full border border-[#444444] font-zen-kaku-gothic text-base tracking-[0.06em] transition-colors ${
              selectedTab === tab.id
                ? "bg-[#F0EAE4] text-[#444444]"
                : "bg-white text-[#444444] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 房间选择按钮 */}
      {selectedTab && (
        <div className="grid grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              className={`flex items-center border rounded-md overflow-hidden transition-colors py-2 ${
                selectedRoom === room.id
                  ? "border-[#444444] bg-[#F0EAE4]"
                  : "border-[#BBBBBB] bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleRoomSelection(room.id)}
            >
              <div className="relative h-10 w-16 flex-shrink-0 ml-3">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                />
              </div>
              <div className="flex-grow px-3 text-left truncate">
                <span className="font-zen-kaku-gothic text-base font-bold tracking-[0.06em] text-[#444444]">
                  {room.name}
                </span>
              </div>
              <div
                className="p-1.5 mr-2 rounded-full hover:bg-gray-100"
                onClick={(e) => handleInfoClick(room.id, e)}
              >
                <InfoIcon className="h-4 w-4 text-[#444444]" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 日期时间选择组件 */}
      {selectedRoom && <DateTimeSelection selectedRoomType={selectedRoom} />}

      {isMounted && showInfoModal && (
        <RoomInfoModal
          room={selectedRoomInfo}
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </div>
  );
}
