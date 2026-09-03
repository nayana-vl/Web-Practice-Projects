// table.component.ts
import { Component, inject, signal } from '@angular/core';
import { Expense, ExpenseService } from '../../../../services/expense.service';

@Component({
  selector: 'table-component',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  private expenseService = inject(ExpenseService);

  groupedExpenses = this.expenseService.groupedExpenses;

  // tracks which date row is expanded
  activeDate = signal<string>('');

  toggleRow(date: string): void {
    this.activeDate.set(this.activeDate() === date ? '' : date);
  }

   getTotalAmount(entries: Expense[]): string {
    const total = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return total.toFixed(2);
  }
}
