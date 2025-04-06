"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import DateTimeTable from "../DateTimeTable";
import Precautions from "../Precautions";
import { TimeSlot } from "../types";

type RoomType =
  | "tototo"
  | "fuuu"
  | "zabuun"
  | "toron"
  | "sauna_suite"
  | "slow_room";

// 是否为纯sauna房间
const isPureSaunaRoom = (roomType: RoomType): boolean => {
  return ["tototo", "fuuu", "zabuun", "toron"].includes(roomType);
};

// 不同房间的时间段配置
const roomTimeSlots: Record<RoomType, TimeSlot[]> = {
  tototo: [
    {
      time: "10:50〜12:20",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
    {
      time: "13:05〜14:35",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "15:20〜16:50",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "17:35〜19:05",
      availability: ["○", "○", "○", "×", "×", "○", "○"],
    },
    {
      time: "19:50〜21:20",
      availability: ["○", "○", "○", "×", "○", "×", "○"],
    },
    {
      time: "22:05〜23:35",
      availability: ["○", "○", "○", "×", "○", "○", "×"],
    },
    {
      time: "00:20〜01:50",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
  ],
  fuuu: [
    {
      time: "11:50〜13:20",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "13:55〜15:25",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "16:00〜17:30",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
    {
      time: "18:05〜19:35",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "20:10〜21:40",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
    {
      time: "22:15〜24:45",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "00:20〜01:50",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
  ],
  zabuun: [
    {
      time: "10:50〜12:20",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "12:55〜14:25",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "15:00〜16:30",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "17:05〜18:35",
      availability: ["○", "○", "○", "×", "×", "○", "○"],
    },
    {
      time: "19:10〜20:40",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "21:15〜22:45",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
    {
      time: "23:20〜00:50",
      availability: ["○", "○", "○", "×", "○", "○", "×"],
    },
  ],
  toron: [
    {
      time: "10:35〜12:05",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "12:40〜14:10",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "14:45〜16:15",
      availability: ["○", "○", "○", "×", "○", "×", "○"],
    },
    {
      time: "16:50〜18:20",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
    {
      time: "18:55〜20:25",
      availability: ["○", "○", "×", "×", "○", "○", "○"],
    },
    {
      time: "21:00〜22:30",
      availability: ["○", "×", "○", "×", "○", "○", "○"],
    },
    {
      time: "23:05〜00:35",
      availability: ["○", "○", "○", "×", "×", "○", "○"],
    },
  ],
  sauna_suite: [
    {
      time: "14:00〜17:00",
      availability: ["○", "×", "○", "×", "○", "×", "○"],
    },
    {
      time: "18:30〜21:00",
      availability: ["×", "○", "○", "×", "○", "○", "○"],
    },
  ],
  slow_room: [
    {
      time: "9:00〜11:00",
      availability: ["○", "×", "○", "×", "○", "△", "△"],
    },
    {
      time: "11:30〜13:30",
      availability: ["○", "○", "○", "×", "×", "○", "○"],
    },
    {
      time: "14:00〜16:00",
      availability: ["×", "○", "○", "×", "○", "△", "○"],
    },
    {
      time: "16:30〜18:30",
      availability: ["○", "○", "△", "×", "○", "△", "○"],
    },
    {
      time: "19:00〜21:00",
      availability: ["○", "×", "○", "×", "○", "×", "○"],
    },
    {
      time: "21:30〜23:30",
      availability: ["○", "○", "○", "×", "○", "×", "○"],
    },
  ],
};

// 星期几标签（用于显示slow room选择部分的日期）
const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

interface Props {
  selectedRoomType: RoomType;
}

export default function DateTimeSelection({ selectedRoomType }: Props) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [currentDate] = useState(new Date()); // 使用当前日期
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );
  const [showSlowRoomSelection, setShowSlowRoomSelection] = useState(false);
  const [skipSlowRoom, setSkipSlowRoom] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  // Slow Room时间选择相关状态
  const [startHour, setStartHour] = useState<number>(10);
  const [startMinute, setStartMinute] = useState<string>("00");
  const [endHour, setEndHour] = useState<number>(13);
  const [endMinute, setEndMinute] = useState<string>("00");
  const [selectedPrice, setSelectedPrice] = useState<{
    price: number;
    hours: number;
  }>({ price: 4500, hours: 3 });

  // 时间选择选项
  const availableStartHours = Array.from({ length: 15 }, (_, i) => i + 9); // 9:00 - 23:00
  const minutes = ["00", "30"];

  // 根据开始时间计算可选的结束时间
  const availableEndHours = Array.from(
    { length: 24 - startHour },
    (_, i) => i + startHour + 1
  ).filter((hour) => hour <= 23); // 限制最大到23点

  // 当开始时间变化时，确保结束时间始终大于开始时间
  useEffect(() => {
    // 如果结束时间小于等于开始时间，自动调整结束时间
    if (
      endHour <= startHour ||
      (endHour === startHour && endMinute <= startMinute)
    ) {
      // 设置结束时间为开始时间+1小时
      setEndHour(startHour + 1 > 23 ? 23 : startHour + 1);
      setEndMinute(startMinute);
    }
  }, [startHour, startMinute, endHour, endMinute]);

  // 计算价格
  const calculatePrice = useCallback(
    (startH: number, startM: string, endH: number, endM: string) => {
      const totalHours =
        endH - startH + (endM === "30" ? 0.5 : 0) - (startM === "30" ? 0.5 : 0);

      // 价格计算逻辑，这里简化处理
      const price = Math.round(totalHours * 1500);

      setSelectedPrice({ price, hours: totalHours });
    },
    [setSelectedPrice]
  );

  // 重置时间选择
  const resetTimeSelection = useCallback(() => {
    setStartHour(10);
    setStartMinute("00");
    setEndHour(13);
    setEndMinute("00");
    setSelectedPrice({ price: 4500, hours: 3 });
  }, []);

  // 当房间类型变化时，重置状态
  useEffect(() => {
    setSelectedDateIndex(null);
    setSelectedTimeIndex(null);
    setShowSlowRoomSelection(false);
    setSkipSlowRoom(false);
    resetTimeSelection();
    setAgreeToTerms(false);
    setShowTermsError(false);
  }, [selectedRoomType, resetTimeSelection]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  // 处理时间变化
  const handleTimeChange = useCallback(() => {
    calculatePrice(startHour, startMinute, endHour, endMinute);
  }, [calculatePrice, startHour, startMinute, endHour, endMinute]);

  // 监听时间变化
  useEffect(() => {
    handleTimeChange();
  }, [startHour, startMinute, endHour, endMinute, handleTimeChange]);

  // 处理时间段选择
  const handleTimeSlotSelection = (dateIndex: number, timeIndex: number) => {
    setSelectedDateIndex(dateIndex);
    setSelectedTimeIndex(timeIndex);

    // 只在选择纯sauna房间时才显示slow_room选项
    if (isPureSaunaRoom(selectedRoomType)) {
      setShowSlowRoomSelection(true);
    } else {
      setShowSlowRoomSelection(false);
      setSkipSlowRoom(false);
    }
  };

  // 处理"次へ進む"按钮点击
  const handleReservation = () => {
    if (!agreeToTerms) {
      setShowTermsError(true);
      return;
    }

    // 获取所选日期和时间段对应的价格
    let timeSlotPrice = 0;
    let selectedTimeValue = null;

    // 使用模拟数据生成预约信息
    if (selectedDateIndex !== null && selectedTimeIndex !== null) {
      // 获取所选日期对应的时间段
      const selectedTimeSlot =
        roomTimeSlots[selectedRoomType][selectedTimeIndex];

      // 获取所选时间段
      if (selectedTimeSlot) {
        selectedTimeValue = selectedTimeSlot.time;
        // 假设每个时间段有固定价格
        timeSlotPrice = 8000; // 示例价格
      }
    }

    // 获取选中的日期
    let selectedDateValue = null;
    if (selectedDateIndex !== null) {
      selectedDateValue = dates[selectedDateIndex].toISOString();
    }

    // 保存选择的时间和日期信息到localStorage
    const selectedInfo = {
      selectedRoomType,
      selectedDate: selectedDateValue,
      selectedTime: selectedTimeValue,
      timeSlotPrice: timeSlotPrice,
      needSlowRoom: !skipSlowRoom,
      slowRoomTimeRange: !skipSlowRoom
        ? {
            startTime: `${String(startHour).padStart(2, "0")}:${startMinute}`,
            endTime: `${String(endHour).padStart(2, "0")}:${endMinute}`,
            price: selectedPrice.price,
            hours: selectedPrice.hours,
          }
        : null,
    };

    // 将信息存储到localStorage
    localStorage.setItem("reservationInfo", JSON.stringify(selectedInfo));

    // 使用Auth0检查用户是否已登录
    if (user) {
      // 已登录用户直接跳转到预约确认页面
      router.push("/reservation/confirm");
    } else {
      // 未登录用户跳转到Auth0登录页面，并设置登录后返回到预约确认页面
      const returnTo = `${window.location.origin}/reservation/confirm`;
      window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(
        returnTo
      )}`;
    }
  };

  // 处理checkbox变化
  const handleTermsChange = () => {
    setAgreeToTerms(!agreeToTerms);
    if (showTermsError) setShowTermsError(false);
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
        <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
          日時を選んでください
        </h1>
      </div>

      <DateTimeTable
        selectedRoomType={selectedRoomType}
        dates={dates}
        timeSlots={[]} // 传递空数组，DateTimeTable会自行获取时间槽
        selectedDateIndex={selectedDateIndex}
        selectedTimeIndex={selectedTimeIndex}
        onTimeSlotSelect={handleTimeSlotSelection}
      />

      {/* Slow Room 选择部分 */}
      {showSlowRoomSelection && selectedDateIndex !== null && (
        <div className="mt-16 space-y-4">
          <div className="pb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
                  休憩ルーム（slow room）を選択
                </h2>
                <span className="text-sm font-bold text-[#D77777] border-2 border-[#D77777] rounded px-2 py-0.5 whitespace-nowrap font-zen-kaku-gothic">
                  セット割引¥1,000円
                </span>
              </div>
              <p className="text-sm text-[#444444] mt-2 font-zen-kaku-gothic">
                サウナの前後にゆっくり休憩できる個室をご利用いただけます。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="skip-slow-room"
                className="w-5 h-5 accent-[#444444]"
                checked={skipSlowRoom}
                onChange={() => setSkipSlowRoom(!skipSlowRoom)}
              />
              <label
                htmlFor="skip-slow-room"
                className="text-[#444444] font-zen-kaku-gothic cursor-pointer"
              >
                slow roomを利用しない
              </label>
            </div>
          </div>

          {!skipSlowRoom && (
            <div className="border border-[#BBBBBB] rounded-lg p-6 bg-white">
              <div className="mb-2 text-[#444444] font-zen-kaku-gothic font-bold">
                {`${dates[selectedDateIndex].getFullYear()}年${
                  dates[selectedDateIndex].getMonth() + 1
                }月${dates[selectedDateIndex].getDate()}日(${
                  weekDays[dates[selectedDateIndex].getDay()]
                })`}
              </div>

              <div className="flex gap-4 items-center mb-6">
                <select
                  className="border rounded px-3 py-0 text-[#444444] text-sm h-8 leading-normal flex items-center"
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                >
                  {availableStartHours.map((hour) => (
                    <option key={hour} value={hour} className="py-0 my-0">
                      {String(hour).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-[#444444]">:</span>
                <select
                  className="border rounded px-3 py-0 text-[#444444] text-sm h-8 leading-normal flex items-center"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute} className="py-0 my-0">
                      {minute}
                    </option>
                  ))}
                </select>
                <span className="text-[#444444] mx-2">〜</span>
                <select
                  className="border rounded px-3 py-0 text-[#444444] text-sm h-8 leading-normal flex items-center"
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                >
                  {availableEndHours.map((hour) => (
                    <option key={hour} value={hour} className="py-0 my-0">
                      {String(hour).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-[#444444]">:</span>
                <select
                  className="border rounded px-3 py-0 text-[#444444] text-sm h-8 leading-normal flex items-center"
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute} className="py-0 my-0">
                      {minute}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-left mb-4 text-[#444444] font-zen-kaku-gothic">
                ¥{selectedPrice.price.toLocaleString()} / {selectedPrice.hours}
                時間
              </div>

              <div className="text-sm text-[#444444] font-zen-kaku-gothic">
                利用可能時間：1回の予約につき、3時間〜6時間
              </div>
            </div>
          )}
        </div>
      )}

      {/* 予約確認画面へ按钮 */}
      <div
        className="my-14 flex justify-center"
        style={{ marginTop: "56px", marginBottom: "56px" }}
      >
        <button
          className={`px-24 py-3 rounded-full font-zen-kaku-gothic text-white text-sm font-medium transition-colors ${
            selectedDateIndex !== null &&
            selectedTimeIndex !== null &&
            (skipSlowRoom || (!skipSlowRoom && selectedPrice))
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-[#BBBBBB] cursor-not-allowed"
          }`}
          disabled={
            selectedDateIndex === null ||
            selectedTimeIndex === null ||
            (!skipSlowRoom && !selectedPrice)
          }
          onClick={handleReservation}
        >
          予約確認画面へ
        </button>
      </div>

      {/* 利用規約同意チェックボックス */}
      <div className="flex justify-center items-center mb-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree-to-terms"
              className="w-5 h-5 accent-[#444444]"
              checked={agreeToTerms}
              onChange={handleTermsChange}
            />
            <label
              htmlFor="agree-to-terms"
              className="text-[#444444] font-zen-kaku-gothic cursor-pointer"
            >
              利用規約に同意する
            </label>
          </div>
          {showTermsError && (
            <p className="text-red-600 text-sm mt-2 font-zen-kaku-gothic">
              利用規約に同意してください。
            </p>
          )}
        </div>
      </div>

      {/* 注意事项 */}
      <Precautions />
    </div>
  );
}
