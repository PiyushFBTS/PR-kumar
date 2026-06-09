import { prisma } from "@/lib/prisma";

// Day keys are computed in IST so "today" matches the firm's calendar day.
const TZ = "Asia/Kolkata";

export function dayKey(d: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

// Increment today's view counter (one row per day).
export async function recordView(): Promise<void> {
  const day = dayKey();
  await prisma.dailyView.upsert({
    where: { day },
    create: { day, count: 1 },
    update: { count: { increment: 1 } },
  });
}

export interface ViewStats {
  today: number;
  allTime: number;
  last7: { day: string; label: string; count: number }[];
}

export async function getViewStats(): Promise<ViewStats> {
  const todayKey = dayKey();

  // Build the last 7 day keys (oldest → newest), including today.
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push(dayKey(new Date(Date.now() - i * 86_400_000)));
  }

  const [rows, agg] = await Promise.all([
    prisma.dailyView.findMany({ where: { day: { in: days } } }),
    prisma.dailyView.aggregate({ _sum: { count: true } }),
  ]);

  const byDay = new Map(rows.map((r) => [r.day, r.count]));
  const last7 = days.map((day) => ({
    day,
    label: new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: TZ }).format(
      new Date(`${day}T00:00:00`),
    ),
    count: byDay.get(day) ?? 0,
  }));

  return {
    today: byDay.get(todayKey) ?? 0,
    allTime: agg._sum.count ?? 0,
    last7,
  };
}
