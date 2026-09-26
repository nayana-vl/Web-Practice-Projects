import { Expenses } from './expenses.class';

export interface WeeksHeatmapResult {
  matrix: number[][];
  weeklyTotals: number[];
  weekLabels: string[];
}

export function buildCurrentMonthExpenseHeatmap(
  expenses: Expenses[],
  year: number,
  month: number // 0-indexed (0 = January, 8 = September)
): WeeksHeatmapResult {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const totalCells = firstDay.getDay() + daysInMonth;
  const weekCount = Math.ceil(totalCells / 7);

  const heatmap: number[][] = Array.from({ length: weekCount }, () => Array(7).fill(0));
  const weekLabels: string[] = [];

  // Build daily totals map (only for expenses within this month/year)
  const dailyTotals = new Map<string, number>();
  expenses.forEach(expense => {
    const dateObj = new Date(expense.date);
    if (isNaN(dateObj.getTime())) {
      return;
    }
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month) {
      return;
    }
    const key = dateObj.toDateString();
    const amount = parseFloat(expense.amount) || 0;
    dailyTotals.set(key, (dailyTotals.get(key) || 0) + amount);
  });

  // Fill each day into the correct week row / day-of-week column
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    const cellIndex = firstDay.getDay() + day - 1;
    const week = Math.floor(cellIndex / 7);

    const key = currentDate.toDateString();
    const amount = dailyTotals.get(key) || 0;
    heatmap[week][dayOfWeek] = amount;
  }

  // Build week labels (e.g., "Sep 1 - Sep 7") based on actual date ranges per row
  for (let week = 0; week < weekCount; week++) {
    const weekStartCellIndex = week * 7 - firstDay.getDay();
    const weekEndCellIndex = weekStartCellIndex + 6;

    const startDayNum = Math.max(1, weekStartCellIndex + 1);
    const endDayNum = Math.min(daysInMonth, weekEndCellIndex + 1);

    const startDate = new Date(year, month, startDayNum);
    const endDate = new Date(year, month, endDayNum);

    weekLabels.push(
      `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    );
  }

  const weeklyTotals = heatmap.map(weekRow =>
    weekRow.reduce((sum, val) => sum + val, 0)
  );

  return { matrix: heatmap, weeklyTotals, weekLabels };
}
