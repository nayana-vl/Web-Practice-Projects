import { Expenses } from './expenses.class';
import { ChartJsData } from '../pages/pages/components/bar-charts.component/bar-chart.component';

export interface YearlyHeatmapResult {
  matrix: number[][];
  monthlyTotals: number[];
  monthLabels: string[];
}

const BAR_COLOR = '#3f9bd8'; // single blue color for all bars

const COLOR_PALETTE = [
  '#3f9bd8', '#0064a3', '#b71c1c', '#f0a30a', '#5cb85c',
  '#8e44ad', '#16a085', '#e67e22', '#2c3e50', '#c0392b'
];

export function buildYearlyExpenseHeatmap(
  expenses: Expenses[],
  year: number
): YearlyHeatmapResult {
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyValues = Array(12).fill(0);

  expenses.forEach(expense => {
    const dateObj = new Date(expense.date);
    if (isNaN(dateObj.getTime())) {
      return;
    }
    if (dateObj.getFullYear() !== year) {
      return;
    }
    const monthIndex = dateObj.getMonth();
    const amount = parseFloat(expense.amount) || 0;
    monthlyValues[monthIndex] += amount;
  });

  const yearTotal = monthlyValues.reduce((sum, val) => sum + val, 0);

  return {
    matrix: [monthlyValues],
    monthlyTotals: [yearTotal],
    monthLabels
  };
}

export function buildTopItemsBarChartData(
  expenses: Expenses[],
  topN: number = 10
): ChartJsData {
  const totalsByItem = new Map<string, number>();

  expenses.forEach(expense => {
    const key = expense.items?.trim() || 'Unknown';
    const amount = parseFloat(expense.amount) || 0;
    totalsByItem.set(key, (totalsByItem.get(key) || 0) + amount);
  });

  const sortedItems = Array.from(totalsByItem.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  const labels = sortedItems.map(([label]) => label);
  const values = sortedItems.map(([, value]) => value);

  return {
    labels,
    datasets: [
      {
        label: 'Amount Spent',
        data: values,
        backgroundColor: labels.map(() => BAR_COLOR), // single color for all bars
        borderRadius: 4,
      }
    ]
  };
}

export function buildTopCategoriesBarChartData(
  expenses: Expenses[],
  topN: number = 10
): ChartJsData {
  const totalsByCategory = new Map<string, number>();

  expenses.forEach(expense => {
    const key = expense.tags?.trim() || 'Uncategorized';
    const amount = parseFloat(expense.amount) || 0;
    totalsByCategory.set(key, (totalsByCategory.get(key) || 0) + amount);
  });

  const sortedCategories = Array.from(totalsByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  const labels = sortedCategories.map(([label]) => label);
  const values = sortedCategories.map(([, value]) => value);

  return {
    labels,
    datasets: [
      {
        label: 'Amount Spent',
        data: values,
        backgroundColor: labels.map((_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]),
        borderRadius: 4,
      }
    ]
  };
}

export function buildYearlyTotalsDoughnutChartData(
  expenses: Expenses[]
): { chartData: ChartJsData; totalAmount: number } {
  const currentYear = new Date().getFullYear();
  const totalsByYear = new Map<number, number>();

  expenses.forEach(expense => {
    const dateObj = new Date(expense.date);
    if (isNaN(dateObj.getTime())) {
      return;
    }
    const year = dateObj.getFullYear();
    if (year > currentYear) {
      return; // exclude future years
    }
    const amount = parseFloat(expense.amount) || 0;
    totalsByYear.set(year, (totalsByYear.get(year) || 0) + amount);
  });

  const sortedYears = Array.from(totalsByYear.keys()).sort((a, b) => a - b);

  const labels = sortedYears.map(year => `${year}`);
  const values = sortedYears.map(year => totalsByYear.get(year) || 0);

  const totalAmount = values.reduce((sum, val) => sum + val, 0);

  const chartData: ChartJsData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]),
        borderWidth: 0,
      }
    ]
  };

  return { chartData, totalAmount };
}