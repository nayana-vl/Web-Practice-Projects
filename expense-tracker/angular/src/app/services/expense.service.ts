import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseData } from './expenses.class';

export interface Expense {
  id?: number;
  items: string;
  tags: string;
  amount: string;
  date: string;
  time: string;
}

export interface GroupedExpense {
  date: string;
  entries: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/expenses';

  private expensesSignal = signal<Expense[]>([]);

  readonly expenses = computed(() => this.expensesSignal());

  readonly groupedExpenses = computed(() => {
    const groups = new Map<string, Expense[]>();

    this.expensesSignal().forEach(expense => {
      if (!groups.has(expense.date)) {
        groups.set(expense.date, []);
      }

      groups.get(expense.date)!.push(expense);
    });

    return Array.from(groups.entries())
      .map(([date, entries]) => ({ date, entries }))
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  });

  // Load expenses from MariaDB through the Node.js API
loadExpenses(onLoaded?: () => void): void {
  this.http.get<Expense[]>(this.apiUrl).subscribe({
    next: expenses => {
      this.expensesSignal.set(
        expenses.map(expense => ({
          ...expense,
          amount: String(expense.amount),
          date: String(expense.date).slice(0, 10)
        }))
      );

      onLoaded?.();
    },
    error: error => {
      console.error('Failed to load expenses:', error);
    }
  });
}
  // Save a new expense to MariaDB
  addExpense(expense: Expense): void {
    this.http.post<Expense>(this.apiUrl, {
      items: expense.items,
      tags: expense.tags,
      amount: Number(expense.amount),
      date: expense.date,
      time: expense.time
    }).subscribe({
      next: savedExpense => {
        this.expensesSignal.update(current => [
          {
            ...savedExpense,
            amount: String(savedExpense.amount),
            date: String(savedExpense.date).slice(0, 10)
          },
          ...current
        ]);
      },
      error: error => {
        console.error('Failed to save expense:', error);
        alert('Could not save expense. Please try again.');
      }
    });
  }

  getExpenses(): Expense[] {
    return this.expensesSignal();
  }
}