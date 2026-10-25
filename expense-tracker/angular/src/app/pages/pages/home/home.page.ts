// home.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { buildTopItemsBarChartData } from '../../../services/yearly-chart-data.service';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomeComponent implements OnInit {

  // ── Date (static display, no live timer) ─────────
  today: string = '';
  todayDateKey: string = '';

  // ── Expense Inputs ───────────────────────────────
  expenseItems: string = '';
  expenseAmount: string = '';
  selectedCategory: string = '';

  // ── Daily Spending Overview ───────────────────────
  todaysTotal: string = '0';
  weeklyTotal: string = '0';
  topItem: string = '-';
  topItemAmount: string = '0';

  private expenseService = inject(ExpenseService);

ngOnInit(): void {
  this.setTodayDate();

  this.expenseService.loadExpenses(() => {
    this.refreshOverview();
  });
}

private setTodayDate(): void {
  const now = new Date();

  // Display date
  this.todayDateKey = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Database date: YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  this.todayDateKey = `${year}-${month}-${day}`;
}

  selectCategory(label: string): void {
    this.selectedCategory = label;
  }

  addExpense(): void {
    if (!this.expenseItems.trim() || !this.expenseAmount || !this.selectedCategory) {
      return;
    }

    const now = new Date();
    const time = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join(':');

    this.expenseService.addExpense({
      items:  this.expenseItems.trim(),
      tags:   this.selectedCategory,
      amount: this.expenseAmount,
      date:   this.todayDateKey,
      time:   time
    });

    // ── Reset after add ───────────────────────────
    this.expenseItems = '';
    this.expenseAmount = '';
    this.selectedCategory = '';

    this.refreshOverview();
  }

  private refreshOverview(): void {
    const allExpenses = this.expenseService.expenses();

    // ── Today's Total ─────────────────────────────
    const todaysExpenses = allExpenses.filter(e => e.date === this.todayDateKey);
    const todaysSum = todaysExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    this.todaysTotal = todaysSum.toFixed(2);

    // ── This Week's Total (last 7 days including today) ──
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyExpenses = allExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      if (isNaN(expenseDate.getTime())) {
        return false;
      }
      return expenseDate >= sevenDaysAgo && expenseDate <= now;
    });

    const weeklySum = weeklyExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    this.weeklyTotal = weeklySum.toFixed(2);

    // ── Top Item by Spend ──────────────────────────
    const topItemsData = buildTopItemsBarChartData(allExpenses, 1);

    if (topItemsData.labels.length > 0) {
      this.topItem = topItemsData.labels[0];
      this.topItemAmount = topItemsData.datasets[0].data[0].toFixed(2);
    } else {
      this.topItem = '-';
      this.topItemAmount = '0';
    }
  }
}