import { NextRequest, NextResponse } from "next/server";

// 设置此API路由为动态路由，不进行静态生成
export const dynamic = "force-dynamic";

// 房间名称映射
const ROOM_NAMES: Record<string, string> = {
  tototo: "TOTOTO",
  fuuu: "FUUU",
  zabuun: "ZABUUN",
  toron: "TORON",
  sauna_suite: "サウナスイート",
  slow_room: "スロールーム",
};

// 星期名称
const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// 日本的法定假日（2024年部分）
const HOLIDAYS_2024 = [
  "2024-01-01", // 元旦
  "2024-01-08", // 成人の日
  "2024-02-11", // 建国記念日
  "2024-02-12", // 振替休日
  "2024-02-23", // 天皇誕生日
  "2024-03-20", // 春分の日
  "2024-04-29", // 昭和の日
  "2024-05-03", // 憲法記念日
  "2024-05-04", // みどりの日
  "2024-05-05", // こどもの日
  "2024-05-06", // 振替休日
  "2024-07-15", // 海の日
  "2024-08-11", // 山の日
  "2024-08-12", // 振替休日
  "2024-09-16", // 敬老の日
  "2024-09-23", // 秋分の日
  "2024-10-14", // スポーツの日
  "2024-11-03", // 文化の日
  "2024-11-04", // 振替休日
  "2024-11-23", // 勤労感謝の日
];

// 检查是否为周末
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0是周日，6是周六
}

// 检查是否为假日
function isHoliday(dateStr: string): boolean {
  return HOLIDAYS_2024.includes(dateStr);
}

// 格式化日期为YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 生成随机状态
function generateRandomStatus(): "○" | "△" | "×" {
  const rand = Math.random();
  if (rand < 0.7) return "○"; // 70%的概率可用
  if (rand < 0.9) return "△"; // 20%的概率有限
  return "×"; // 10%的概率不可用
}

// 房间时间段配置
const ROOM_TIME_SLOTS = {
  tototo: [
    "10:50〜12:20",
    "13:05〜14:35",
    "15:20〜16:50",
    "17:35〜19:05",
    "19:50〜21:20",
    "22:05〜23:35",
    "00:20〜01:50",
  ],
  fuuu: [
    "11:50〜13:20",
    "13:55〜15:25",
    "16:00〜17:30",
    "18:05〜19:35",
    "20:10〜21:40",
    "22:15〜24:45",
    "00:20〜01:50",
  ],
  zabuun: [
    "10:50〜12:20",
    "12:55〜14:25",
    "15:00〜16:30",
    "17:05〜18:35",
    "19:10〜20:40",
    "21:15〜22:45",
    "23:20〜00:50",
  ],
  toron: [
    "10:35〜12:05",
    "12:40〜14:10",
    "14:45〜16:15",
    "16:50〜18:20",
    "18:55〜20:25",
    "21:00〜22:30",
    "23:05〜00:35",
  ],
  sauna_suite: ["14:00〜17:00", "18:30〜21:00"],
  slow_room: [
    "9:00〜11:00",
    "11:30〜13:30",
    "14:00〜16:00",
    "16:30〜18:30",
    "19:00〜21:00",
    "21:30〜23:30",
  ],
};

// 获取房间特定时间段的价格
function getRoomTimeSlotPrice(
  roomId: string,
  timeSlot: string,
  isWeekendOrHoliday: boolean
): number {
  if (isWeekendOrHoliday) {
    // 周末或假日价格
    switch (roomId) {
      case "tototo":
        return 20800;
      case "fuuu":
      case "zabuun":
        return 12800;
      case "toron":
        return 11800;
      case "sauna_suite":
        return 32800;
      case "slow_room":
        return 8900;
      default:
        return 10000;
    }
  }

  // 平日价格，根据时间段不同
  switch (roomId) {
    case "tototo":
      if (["10:50〜12:20", "13:05〜14:35", "15:20〜16:50"].includes(timeSlot)) {
        return 16800;
      } else {
        return 18800;
      }
    case "fuuu":
      if (["11:50〜13:20", "13:55〜15:25"].includes(timeSlot)) {
        return 10800;
      } else {
        return 11800;
      }
    case "zabuun":
      if (["10:50〜12:20", "12:55〜14:25", "15:00〜16:30"].includes(timeSlot)) {
        return 10800;
      } else {
        return 11800;
      }
    case "toron":
      if (["10:35〜12:05", "12:40〜14:10", "14:45〜16:15"].includes(timeSlot)) {
        return 9800;
      } else {
        return 10800;
      }
    case "sauna_suite":
      return timeSlot === "14:00〜17:00" ? 29800 : 29800;
    case "slow_room":
      if (["9:00〜11:00", "11:30〜13:30", "14:00〜16:00"].includes(timeSlot)) {
        return 6900;
      } else {
        return 7900;
      }
    default:
      return 10000;
  }
}

// 根据房间类型获取对应的时间段
function getTimeSlots(
  roomId: string,
  date: Date,
  dateStr: string
): { time: string; price: number }[] {
  const isWeekendOrHoliday = isWeekend(date) || isHoliday(dateStr);
  const timeSlots =
    ROOM_TIME_SLOTS[roomId as keyof typeof ROOM_TIME_SLOTS] || [];

  return timeSlots.map((time) => ({
    time,
    price: getRoomTimeSlotPrice(roomId, time, isWeekendOrHoliday),
  }));
}

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");
    const startDateStr = searchParams.get("startDate");
    const durationStr = searchParams.get("duration");

    // 参数验证
    if (!roomId) {
      return NextResponse.json({ error: "房间ID是必须的" }, { status: 400 });
    }

    if (!startDateStr) {
      return NextResponse.json({ error: "开始日期是必须的" }, { status: 400 });
    }

    // 解析参数
    const startDate = new Date(startDateStr);
    const duration = durationStr ? parseInt(durationStr) : 7; // 默认7天

    // 获取今天的日期（不包含时间）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 计算最大允许日期（今天起3周）
    const maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + 21); // 3周 = 21天

    // 确保开始日期不早于今天
    if (startDate < today) {
      startDate.setTime(today.getTime());
    }

    // 确保我们不会超出最大允许日期
    let validDuration = duration;

    // 计算从开始日期到最大允许日期的天数
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + validDuration - 1);

    // 如果结束日期超过了最大允许日期，则调整结束日期
    if (endDate > maxAllowedDate) {
      // 以最大允许日期为基准，重新计算持续时间
      const millisDiff = maxAllowedDate.getTime() - startDate.getTime();
      const daysDiff = Math.floor(millisDiff / (1000 * 60 * 60 * 24)) + 1;
      validDuration = Math.max(daysDiff, 0);
    }

    // 如果有效持续时间为0，则没有可用的日期范围，返回空数据
    if (validDuration <= 0) {
      return NextResponse.json({
        roomId,
        roomName: ROOM_NAMES[roomId] || "未知房间",
        startDate: formatDate(today),
        endDate: formatDate(today),
        timeSlots: {},
      });
    }

    // 更新结束日期
    endDate.setTime(startDate.getTime());
    endDate.setDate(startDate.getDate() + validDuration - 1);

    // 获取房间名称
    const roomName = ROOM_NAMES[roomId] || "未知房间";

    // 构建时间段数据
    const timeSlots: Record<string, any> = {};

    // 为每一天生成时间段
    for (let i = 0; i < validDuration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // 确保只返回今天及之后的日期
      if (currentDate < today) {
        continue;
      }

      const dateStr = formatDate(currentDate);
      const dayOfWeek = DAYS_OF_WEEK[currentDate.getDay()];

      // 获取当天的时间段和价格
      const baseTimeSlots = getTimeSlots(roomId, currentDate, dateStr);

      // 构建当天的时间段
      const daySlots = baseTimeSlots.map(({ time, price }) => {
        return {
          time,
          status: generateRandomStatus(),
          price: price,
        };
      });

      // 设置当天的数据
      timeSlots[dateStr] = {
        dayOfWeek,
        isHoliday: isHoliday(dateStr),
        slots: daySlots,
      };
    }

    // 确保至少有一天的数据（今天）
    if (Object.keys(timeSlots).length === 0) {
      const todayStr = formatDate(today);
      const dayOfWeek = DAYS_OF_WEEK[today.getDay()];

      // 获取当天的时间段和价格
      const baseTimeSlots = getTimeSlots(roomId, today, todayStr);

      // 构建当天的时间段
      const daySlots = baseTimeSlots.map(({ time, price }) => {
        return {
          time,
          status: generateRandomStatus(),
          price: price,
        };
      });

      // 设置当天的数据
      timeSlots[todayStr] = {
        dayOfWeek,
        isHoliday: isHoliday(todayStr),
        slots: daySlots,
      };

      // 更新开始日期为今天
      startDate.setTime(today.getTime());
      endDate.setTime(today.getTime());
    }

    // 构建响应数据
    const response = {
      roomId,
      roomName,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      timeSlots,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("获取房间可用性出错:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
