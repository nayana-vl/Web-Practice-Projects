import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Expense, ExpenseService } from '../../../services/expense.service';
import { DateScrubberComponent } from '../components/date-scrubber/date-scrubber.component';
import { TrackerSearchComponent } from '../components/tracker-search/tracker-search.component';
import { FngDateRangePickerComponent } from '@festo-ui/angular';
import { HeatmapComponent, LegendItem } from '../components/heatmap/heatmap.component';
import { buildCurrentMonthExpenseHeatmap } from '../../../services/weekly-chart-data.service';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DateScrubberComponent,
    TrackerSearchComponent,
    FngDateRangePickerComponent,
    HeatmapComponent
  ],
  templateUrl: './table.page.html',
  styleUrl: './table.page.scss'
})
export class TableComponent implements OnInit {

  private expenseService = inject(ExpenseService);

  groupedExpenses = this.expenseService.groupedExpenses;

  activeDate = signal<string>('');

  dateRange: Date[] = [];
  datePickerOptions: any;
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();

  allTags: string[] = [];
  selectedTags: string[] = [];

  // ── Heatmap State ──────────────────────────────────
  heatmapData: number[][] = [];
  heatmapWeeklyTotals: number[] = [];
  heatmapWeekLabels: string[] = [];

  readonly heatmapDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly heatmapLegendConfig: LegendItem[] = [
    { label: 'Above ₹2000', breakpoint: 2000 },
    { label: '₹1000-2000', breakpoint: 1000 },
    { label: '₹100-1000', breakpoint: 100 },
    { label: '₹1-100', breakpoint: 0 },
    { label: '₹0', breakpoint: -1 }
  ];

  ngOnInit(): void {
    this.onDateRangeReset();
    this.buildAllTags();
  }

  private buildAllTags(): void {
    const tagsSet = new Set<string>();
    this.groupedExpenses().forEach(group => {
      group.entries.forEach((entry: Expense) => {
        if (entry.description) {
          tagsSet.add(entry.description);
        }
      });
    });
    this.allTags = Array.from(tagsSet);
  }

  // ── Filters expenses by BOTH date range AND tags (used for TABLE) ──────
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
      const withinRange = expenseDate >= start && expenseDate <= end;
      if (!withinRange) {
        return false;
      }

      if (this.selectedTags.length === 0) {
        return true;
      }
      return this.selectedTags.some(tag =>
        expense.description?.toLowerCase().includes(tag.toLowerCase())
      );
    });
  }

  // ── Table uses date-range + tag filtered expenses, re-grouped by date ──
  filteredGroupedExpenses() {
    const filtered = this.getFilteredExpenses();

    const grouped = new Map<string, Expense[]>();
    filtered.forEach(expense => {
      if (!grouped.has(expense.date)) {
        grouped.set(expense.date, []);
      }
      grouped.get(expense.date)!.push(expense);
    });

    return Array.from(grouped.entries())
      .map(([date, entries]) => ({ date, entries }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ── 🔑 Heatmap follows selectedYear/selectedMonth (updated by BOTH date range picker AND scrubber) ──
  private buildHeatmapData(): void {
    const allExpenses: Expense[] = this.groupedExpenses().flatMap(group => group.entries);

    // Apply tag filter only — heatmap always shows the FULL month, not the exact date range
    const tagFiltered = this.selectedTags.length === 0
      ? allExpenses
      : allExpenses.filter(expense =>
          this.selectedTags.some(tag =>
            expense.description?.toLowerCase().includes(tag.toLowerCase())
          )
        );

    const result = buildCurrentMonthExpenseHeatmap(tagFiltered, this.selectedYear, this.selectedMonth);
    this.heatmapData = result.matrix;
    this.heatmapWeeklyTotals = result.weeklyTotals;
    this.heatmapWeekLabels = result.weekLabels;
  }

  // ── Getter for dynamic heatmap title (e.g., "Sep 2026 Expenses") ──
  get heatmapMonthName(): string {
    return new Date(this.selectedYear, this.selectedMonth, 1)
      .toLocaleDateString('en-US', { month: 'short' });
  }

  // ── 🔑 Called by date range picker directly, AND indirectly by scrubber via setRangeToYear/setRangeToMonth ──
  onDateRangeChange(dateRange: Date[]): void {
    this.dateRange = dateRange;
    const [start] = dateRange;
    this.selectedYear = start.getFullYear();
    this.selectedMonth = start.getMonth();
    this.buildHeatmapData();   // 👈 heatmap rebuilds every time date range OR scrubber changes
  }

  onDateRangeReset(): void {
    this.dateRange = [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()];
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

  setRangeToMonth(selectedYear: number, selectedMonth: number): void {
    this.dateRange = [
      new Date(selectedYear, selectedMonth, 1),
      new Date(selectedYear, selectedMonth, new Date(selectedYear, selectedMonth + 1, 0).getDate())
    ];
    this.onDateRangeChange(this.dateRange);
  }

  onYearChange(newYear: number): void {
    this.selectedYear = newYear;
    this.setRangeToYear(this.selectedYear);
  }

  onMonthChange(newMonth: number): void {
    this.selectedMonth = newMonth;
    this.setRangeToMonth(this.selectedYear, this.selectedMonth);
  }

  onFilterTagsSelected(selectedTags: string[]): void {
    this.selectedTags = selectedTags;
    this.buildHeatmapData();
  }

  toggleRow(date: string): void {
    this.activeDate.set(this.activeDate() === date ? '' : date);
  }

  getTotalAmount(entries: Expense[]): string {
    const total = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return total.toFixed(2);
  }
}