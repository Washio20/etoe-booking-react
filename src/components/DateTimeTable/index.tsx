"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimeSlot } from "../types";

type RoomType =
  | "tototo"
  | "fuuu"
  | "zabuun"
  | "toron"
  | "sauna_suite"
  | "slow_room";

// 定义API返回的时间段数据类型
interface RoomAvailabilityResponse {
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  timeSlots: {
    [date: string]: {
      dayOfWeek: string;
      isHoliday: boolean;
      slots: {
        time: string;
        status: "○" | "△" | "×";
        price: number;
      }[];
    };
  };
}

export interface DateTimeTableProps {
  selectedRoomType: RoomType;
  timeSlots: TimeSlot[]; // 父组件传入的初始时间槽（仅用于UI渲染结构）
  dates: Date[]; // 父组件传入的初始日期范围（仅用于UI渲染结构）
  selectedDateIndex: number | null;
  selectedTimeIndex: number | null;
  onTimeSlotSelect: (dateIndex: number, timeIndex: number) => void;
}

const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

export default function DateTimeTable({
  selectedRoomType,
  timeSlots,
  dates,
  selectedDateIndex,
  selectedTimeIndex,
  onTimeSlotSelect,
}: DateTimeTableProps) {
  // API数据相关状态
  const [availabilityData, setAvailabilityData] =
    useState<RoomAvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<Date>(() => {
    // 初始化为今天日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // 格式化日期为YYYY-MM-DD
  const formatDateForApi = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // 加载房间可用性数据
  const loadRoomAvailabilityData = useCallback(
    async (roomId: string, startDate: Date) => {
      if (!roomId) return;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(
          `/api/room-availability?roomId=${roomId}&startDate=${formatDateForApi(
            startDate
          )}&duration=7`
        );

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }

        const data = await response.json();
        setAvailabilityData(data);
      } catch (error) {
        console.error("予約データの取得に失敗しました:", error);
        setApiError(
          "予約データの読み込みに失敗しました。後でもう一度お試しください。"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formatDateForApi]
  );

  // 当房间类型变化时，加载该房间的可用性数据
  useEffect(() => {
    if (selectedRoomType) {
      // 房间类型变化时，重置为当天日期
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setCurrentWeekStartDate(today);
      loadRoomAvailabilityData(selectedRoomType, today);
    }
  }, [selectedRoomType, loadRoomAvailabilityData]);

  // 使用API返回的数据生成时间槽
  const generateTimeSlotsFromApiData = useCallback(() => {
    if (!availabilityData) return [];

    // 获取日期字符串数组（按日期排序）
    const dateKeys = Object.keys(availabilityData.timeSlots).sort();
    if (dateKeys.length === 0) return [];

    // 获取第一个日期的时间段
    const firstDateSlots = availabilityData.timeSlots[dateKeys[0]].slots;

    // 创建时间槽数组
    return firstDateSlots.map(
      (
        slot: { time: string; status: "○" | "△" | "×"; price: number },
        slotIndex: number
      ) => {
        return {
          time: slot.time,
          availability: dateKeys.map((dateKey) => {
            const dateData = availabilityData.timeSlots[dateKey];
            const slotData = dateData.slots[slotIndex];
            return slotData?.status || "×";
          }),
        } as TimeSlot;
      }
    );
  }, [availabilityData]);

  // 获取API数据中的日期
  const getApiDates = useCallback(() => {
    if (!availabilityData) return [];

    // 获取日期字符串数组（按日期排序）
    const dateKeys = Object.keys(availabilityData.timeSlots).sort();

    // 将日期字符串转换为Date对象
    return dateKeys.map((dateKey) => new Date(dateKey));
  }, [availabilityData]);

  // 判断当前显示的日期是否为当前周或更早
  const isCurrentWeekOrEarlier = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 使用当前周起始日期与今天比较
    return currentWeekStartDate <= today;
  }, [currentWeekStartDate]);

  // 判断当前显示的日期是否为最后一周（今天起第3周）
  const isLastWeekOrLater = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 计算今天起3周后的日期
    const threeWeeksLater = new Date(today);
    threeWeeksLater.setDate(today.getDate() + 14); // 允许查看从今天起2周时间

    // 判断当前周起始日期是否已经接近或超过2周限制
    return currentWeekStartDate >= threeWeeksLater;
  }, [currentWeekStartDate]);

  // 处理前一周按钮点击
  const handlePreviousWeek = useCallback(() => {
    if (isCurrentWeekOrEarlier()) return;

    const newStartDate = new Date(currentWeekStartDate);
    newStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(newStartDate);

    // 加载上一周的数据
    loadRoomAvailabilityData(selectedRoomType, newStartDate);
  }, [
    currentWeekStartDate,
    isCurrentWeekOrEarlier,
    loadRoomAvailabilityData,
    selectedRoomType,
  ]);

  // 处理下一周按钮点击
  const handleNextWeek = useCallback(() => {
    if (isLastWeekOrLater()) return;

    const newStartDate = new Date(currentWeekStartDate);
    newStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(newStartDate);

    // 加载下一周的数据
    loadRoomAvailabilityData(selectedRoomType, newStartDate);
  }, [
    currentWeekStartDate,
    isLastWeekOrLater,
    loadRoomAvailabilityData,
    selectedRoomType,
  ]);

  // 获取实际要显示的时间槽和日期
  const actualTimeSlots = availabilityData
    ? generateTimeSlotsFromApiData()
    : timeSlots;
  const actualDates = availabilityData ? getApiDates() : dates;

  return (
    <div className="relative">
      {/* 加载图标 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-70">
          <div className="h-10 w-10 border-4 border-[#C78C51] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 错误提示 */}
      {apiError && (
        <div className="text-center py-4">
          <p className="text-red-500 font-zen-kaku-gothic">{apiError}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#C78C51] text-base font-zen-kaku-gothic">
                ○
              </span>
              <span className="text-[#444444] text-sm font-zen-kaku-gothic">
                受付中
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#444444] text-base font-zen-kaku-gothic">
                △
              </span>
              <span className="text-[#444444] text-sm font-zen-kaku-gothic">
                残りわずか
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#444444] text-base font-zen-kaku-gothic">
                ×
              </span>
              <span className="text-[#444444] text-sm font-zen-kaku-gothic">
                受付終了
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`w-8 h-8 flex items-center justify-center border border-[#444444] rounded-full ${
                isCurrentWeekOrEarlier() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePreviousWeek}
              disabled={isCurrentWeekOrEarlier()}
            >
              <ChevronLeft className="w-4 h-4 text-[#444444]" />
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center border border-[#444444] rounded-full ${
                isLastWeekOrLater() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNextWeek}
              disabled={isLastWeekOrLater()}
            >
              <ChevronRight className="w-4 h-4 text-[#444444]" />
            </button>
          </div>
        </div>

        <div className="border border-[#BBBBBB] rounded-[4px] overflow-hidden">
          <div className="grid grid-cols-[142px_repeat(7,1fr)]">
            <div className="h-12" />
            {/* 使用API返回的日期或默认日期 */}
            {actualDates.map((date, index) => {
              const dayOfWeek = weekDays[date.getDay()];
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center border-r border-[#BBBBBB] py-2 text-sm tracking-[0.06em] font-medium font-zen-kaku-gothic ${
                    date.getDay() === 6
                      ? "bg-[#6AA3C6] text-[#444444]"
                      : date.getDay() === 0
                      ? "bg-[#D77777] text-[#444444]"
                      : "bg-[#444444] text-white"
                  }`}
                >
                  <div className="leading-tight">{`${
                    date.getMonth() + 1
                  }/${date.getDate()}`}</div>
                  <div className="leading-tight">{dayOfWeek}</div>
                </div>
              );
            })}

            {/* 时间段 */}
            {actualTimeSlots.map((slot, rowIndex) => (
              <div key={rowIndex} className="contents">
                <div className="bg-[#F0EAE4] flex items-center justify-center py-3 text-sm tracking-[0.06em] font-zen-kaku-gothic text-[#444444] border-b border-r border-[#BBBBBB]">
                  {slot.time}
                </div>
                {slot.availability.map((status, colIndex) => {
                  const isSelected =
                    selectedDateIndex === colIndex &&
                    selectedTimeIndex === rowIndex;
                  const isWeekend =
                    actualDates[colIndex]?.getDay() === 0 ||
                    actualDates[colIndex]?.getDay() === 6;

                  return (
                    <div
                      key={colIndex}
                      className={`flex items-center justify-center border-b border-r border-[#BBBBBB] ${
                        status === "×"
                          ? "bg-[#E8E8E8]"
                          : isSelected
                          ? "bg-[#C78C51] bg-opacity-20"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        if (status !== "×") {
                          onTimeSlotSelect(colIndex, rowIndex);
                        }
                      }}
                    >
                      <span
                        className={`text-base tracking-[0.06em] font-zen-kaku-gothic ${
                          status === "×"
                            ? "text-[#444444]"
                            : status === "△"
                            ? "text-[#444444]"
                            : "text-[#C78C51]"
                        } ${status !== "×" ? "cursor-pointer" : ""}`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
