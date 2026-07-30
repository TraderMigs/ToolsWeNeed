const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export function parseLocalDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

export function wholeMonthsUntil(targetDate: string, from = new Date()): number | null {
  const target = parseLocalDate(targetDate);
  if (!target) return null;

  let months = (target.getFullYear() - from.getFullYear()) * 12 + target.getMonth() - from.getMonth();
  if (target.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

interface SavingsProjectionInput {
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export function calculateSavingsProjection(goal: SavingsProjectionInput, from = new Date()) {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const progressPercentage = goal.targetAmount > 0
    ? Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100))
    : 0;
  const monthsRemaining = wholeMonthsUntil(goal.targetDate, from);
  const requiredMonthlyContribution = monthsRemaining && monthsRemaining > 0
    ? remaining / monthsRemaining
    : remaining === 0 ? 0 : null;
  const monthsToCompletion = goal.monthlyContribution > 0
    ? Math.ceil(remaining / goal.monthlyContribution)
    : null;
  const projectedCompletion = monthsToCompletion === null
    ? null
    : new Date(from.getFullYear(), from.getMonth() + monthsToCompletion, from.getDate());

  return {
    remaining,
    progressPercentage,
    monthsRemaining,
    requiredMonthlyContribution,
    onTrack: requiredMonthlyContribution !== null && goal.monthlyContribution >= requiredMonthlyContribution,
    projectedCompletion,
  };
}

export function timeToMinutes(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

export function calculateOvernightHours(start: string, end: string): number | null {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes === null || endMinutes === null) return null;
  const duration = endMinutes > startMinutes
    ? endMinutes - startMinutes
    : 24 * 60 - startMinutes + endMinutes;
  return duration / 60;
}

export function calculateSameDayDurationMinutes(start: string, end: string): number | null {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null;
  return endMinutes - startMinutes;
}
