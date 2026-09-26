import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  // ── Current Time ─────────────────────────────────
  today: string   = '';
  hours: string   = '00';
  minutes: string = '00';
  seconds: string = '00';
  period: string  = 'AM';

  // ── Expense Inputs ───────────────────────────────
  expenseDescription: string = '';
  expenseAmount: string      = '';

  private clockInterval: any;
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.startClock();
  }

  // ── Clock Always Running ──────────────────────────
  private startClock(): void {
    this.tickClock();
    this.clockInterval = setInterval(() => {
      this.tickClock();
      this.cdr.detectChanges();
    }, 1000);
  }

  private tickClock(): void {
    const now = new Date();
    this.today = now.toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'short',
      day:   'numeric'
    });

    let hrs = now.getHours();
    this.period = hrs >= 12 ? 'PM' : 'AM';

    hrs = hrs % 12;
    hrs = hrs === 0 ? 12 : hrs; // 0 should be shown as 12

    this.hours   = this.pad(hrs);
    this.minutes = this.pad(now.getMinutes());
    this.seconds = this.pad(now.getSeconds());
  }

  private pad(val: number): string {
    return val < 10 ? '0' + val : val.toString();
  }

  // ── Add Expense ──────────────────────────────────
  addExpense(): void {
    if (!this.expenseDescription.trim() || !this.expenseAmount) {
      return;
    }

    this.expenseService.addExpense({
      description: this.expenseDescription.trim(),
      amount:      this.expenseAmount,
      date:        this.today,
      time:        `${this.hours}:${this.minutes}:${this.seconds} ${this.period}`
    });
    console.log({
      description: this.expenseDescription.trim(),
      amount:      this.expenseAmount,
      date:        this.today,
      time:        `${this.hours}:${this.minutes}:${this.seconds} ${this.period}`
    });

    // ── Reset after add ───────────────────────────
    this.expenseDescription = '';
    this.expenseAmount      = '';
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }
}