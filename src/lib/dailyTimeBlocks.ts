export type DailyTimeBlockId = "sleep" | "school" | "self" | "self-study";

export type DailyTimeBlock = {
  id: DailyTimeBlockId;
  label: string;
  startMinutes: number;
  endMinutes: number;
};

const MINUTES_PER_DAY = 24 * 60;

export const DAILY_TIME_BLOCKS: DailyTimeBlock[] = [
  { id: "sleep", label: "Sleep", startMinutes: 21 * 60, endMinutes: 5 * 60 },
  { id: "school", label: "School", startMinutes: 5 * 60, endMinutes: 13 * 60 },
  { id: "self", label: "Self", startMinutes: 13 * 60, endMinutes: 17 * 60 },
  { id: "self-study", label: "Self Study", startMinutes: 17 * 60, endMinutes: 21 * 60 },
];

export function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function getBlockDurationMinutes(block: DailyTimeBlock): number {
  const rawDuration = block.endMinutes - block.startMinutes;
  return rawDuration > 0 ? rawDuration : rawDuration + MINUTES_PER_DAY;
}

export function isMinuteInBlock(minuteOfDay: number, block: DailyTimeBlock): boolean {
  if (block.startMinutes < block.endMinutes) {
    return minuteOfDay >= block.startMinutes && minuteOfDay < block.endMinutes;
  }

  return minuteOfDay >= block.startMinutes || minuteOfDay < block.endMinutes;
}

export function getActiveDailyTimeBlock(date: Date = new Date()): DailyTimeBlock {
  const minuteOfDay = getMinutesSinceMidnight(date);

  return (
    DAILY_TIME_BLOCKS.find((block) => isMinuteInBlock(minuteOfDay, block)) ?? DAILY_TIME_BLOCKS[0]
  );
}

export function getNextBlockTransition(date: Date = new Date()): {
  activeBlock: DailyTimeBlock;
  nextTransitionAt: Date;
} {
  const activeBlock = getActiveDailyTimeBlock(date);
  const minuteOfDay = getMinutesSinceMidnight(date);

  const nextTransitionAt = new Date(date);
  nextTransitionAt.setHours(
    Math.floor(activeBlock.endMinutes / 60),
    activeBlock.endMinutes % 60,
    0,
    0
  );

  if (
    activeBlock.startMinutes > activeBlock.endMinutes &&
    minuteOfDay >= activeBlock.startMinutes
  ) {
    nextTransitionAt.setDate(nextTransitionAt.getDate() + 1);
  }

  if (nextTransitionAt.getTime() <= date.getTime()) {
    nextTransitionAt.setDate(nextTransitionAt.getDate() + 1);
  }

  return { activeBlock, nextTransitionAt };
}

export function formatMinutesAsTime(minuteOfDay: number): string {
  const hour24 = Math.floor(minuteOfDay / 60) % 24;
  const minute = minuteOfDay % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function formatBlockRange(block: DailyTimeBlock): string {
  return `${formatMinutesAsTime(block.startMinutes)} - ${formatMinutesAsTime(block.endMinutes)}`;
}

export function formatBlockDuration(block: DailyTimeBlock): string {
  const minutes = getBlockDurationMinutes(block);
  const hours = minutes / 60;

  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}
