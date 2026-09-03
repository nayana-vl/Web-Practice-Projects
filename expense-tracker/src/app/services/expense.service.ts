// expense.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface Expense {
  description: string;
  amount:      string;
  date:        string;
  time:        string;
}

export interface GroupedExpense {
  date:        string;
  entries:     Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expensesSignal = signal<Expense[]>([]);

  readonly expenses = computed(() => this.expensesSignal());

  // groups expenses by date
  readonly groupedExpenses = computed(() => {
    const groups = new Map<string, Expense[]>();

    this.expensesSignal().forEach(expense => {
      if (!groups.has(expense.date)) {
        groups.set(expense.date, []);
      }
      groups.get(expense.date)!.push(expense);
    });

    return Array.from(groups.entries()).map(([date, entries]) => ({
      date,
      entries
    }));
  });

  addExpense(expense: Expense): void {
    this.expensesSignal.update(current => [...current, expense]);
  }

  getExpenses(): Expense[] {
    return this.expensesSignal();
  }
}
