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
    this.refreshOverview();
  }

  private setTodayDate(): void {
    const now = new Date();
    this.today = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  selectCategory(label: string): void {
    this.selectedCategory = label;
  }

  addExpense(): void {
    if (!this.expenseItems.trim() || !this.expenseAmount || !this.selectedCategory) {
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    this.expenseService.addExpense({
      items:  this.expenseItems.trim(),
      tags:   this.selectedCategory,
      amount: this.expenseAmount,
      date:   this.today,
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
    const todaysExpenses = allExpenses.filter(e => e.date === this.today);
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