import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Expense, ExpenseService } from '../../../services/expense.service';
import { DateScrubberComponent } from '../components/date-scrubber/date-scrubber.component';
import { FngDateRangePickerComponent } from '@festo-ui/angular';
import { HeatmapComponent, LegendItem } from '../components/heatmap/heatmap.component';
import { BarChartComponent, ChartJsData } from '../components/bar-charts.component/bar-chart.component';
import { DoughnutChartComponent } from '../components/doughnut-chart.component/doughnut-chart.component';
import { buildYearlyExpenseHeatmap, buildTopItemsBarChartData, buildYearlyTotalsDoughnutChartData } from '../../../services/yearly-chart-data.service';

@Component({
  selector: 'charts-component',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DateScrubberComponent,
    FngDateRangePickerComponent,
    HeatmapComponent,
    BarChartComponent,
    DoughnutChartComponent
  ],
  templateUrl: './charts.page.html',
  styleUrl: './charts.page.scss'
})
export class ChartsComponent implements OnInit {

  private expenseService = inject(ExpenseService);

  groupedExpenses = this.expenseService.groupedExpenses;

  dateRange: Date[] = [];
  datePickerOptions: any;
  selectedYear: number = new Date().getFullYear();

  // ── Heatmap State ──────────────────────────────────
  heatmapData: number[][] = [];
  heatmapMonthlyTotals: number[] = [];
  heatmapMonthLabels: string[] = [];
  heatmapRowLabel: string[] = [];

  readonly heatmapLegendConfig: LegendItem[] = [
    { label: 'Above ₹25000', breakpoint: 25000 },
    { label: '₹10000-25000', breakpoint: 10000 },
    { label: '₹5000-10000', breakpoint: 5000 },
    { label: '₹1-5000', breakpoint: 0 },
    { label: '₹0', breakpoint: -1 }
  ];

  // ── Top 10 Items Bar Chart State ───────────────────
  topItemsChartData!: ChartJsData;

  // ── Yearly Totals Doughnut Chart State (across ALL years up to current) ──
  yearlyDoughnutData!: ChartJsData;
  yearlyTotalAmount: number = 0;

  ngOnInit(): void {
    this.onDateRangeReset();
  }

  private getFilteredExpenses(): Expense[] {
    const allExpenses: Expense[] = this.groupedExpenses().flatMap(group => group.entries);

    const [rangeStart, rangeEnd] = this.dateRange;
    if (!rangeStart || !rangeEnd) {
      return allExpenses;
    }

    const start = new Date(rangeStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(rangeEnd);
    end.setHours(23, 59, 59, 999);

    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate.getTime())) {
        return false;
      }
      return expenseDate >= start && expenseDate <= end;
    });
  }

  private buildHeatmapData(): void {
    const allExpenses: Expense[] = this.getFilteredExpenses();
    const result = buildYearlyExpenseHeatmap(allExpenses, this.selectedYear);
    this.heatmapData = result.matrix;
    this.heatmapMonthlyTotals = result.monthlyTotals;
    this.heatmapMonthLabels = result.monthLabels;
    this.heatmapRowLabel = [`${this.selectedYear}`];
  }

  private buildTopItemsChart(): void {
    const filteredExpenses = this.getFilteredExpenses();
    this.topItemsChartData = buildTopItemsBarChartData(filteredExpenses, 10);
  }

  // 🔑 Doughnut chart now shows TOTAL expenses per YEAR (2026, 2027, ... up to current year),
  // NOT a monthly breakdown — and uses ALL expenses, ignoring the date-range filter.
  private buildYearlyDoughnutChart(): void {
    const allExpenses: Expense[] = this.groupedExpenses().flatMap(group => group.entries);
    const { chartData, totalAmount } = buildYearlyTotalsDoughnutChartData(allExpenses);
    this.yearlyDoughnutData = chartData;
    this.yearlyTotalAmount = totalAmount;
  }

  onDateRangeChange(dateRange: Date[]): void {
    this.dateRange = dateRange;
    const [start] = dateRange;
    this.selectedYear = start.getFullYear();
    this.buildHeatmapData();
    this.buildTopItemsChart();
    this.buildYearlyDoughnutChart();
  }

  onDateRangeReset(): void {
    this.dateRange = [new Date(new Date().getFullYear(), 0, 1), new Date()];
    this.datePickerOptions = {
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(),
      keepOpenOnDateChange: false
    };
    this.onDateRangeChange(this.dateRange);
  }

  setRangeToYear(selectedYear: number): void {
    this.dateRange = [new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31)];
    this.onDateRangeChange(this.dateRange);
  }

  onYearChange(newYear: number): void {
    this.selectedYear = newYear;
    this.setRangeToYear(this.selectedYear);
  }

  get yearlyTotalDisplay(): string {
    return `₹${this.yearlyTotalAmount.toFixed(0)}`;
  }
}