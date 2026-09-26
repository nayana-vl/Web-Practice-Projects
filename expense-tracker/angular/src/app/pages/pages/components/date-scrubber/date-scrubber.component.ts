import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  inject,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'date-scrubber',
  standalone: true,
  templateUrl: './date-scrubber.component.html',
  styleUrls: ['./date-scrubber.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateScrubberComponent implements OnInit, OnChanges {
  @Input() mode: 'year' | 'month' = 'year';
  @Input() initialValue!: number;
  @Output() valueChange = new EventEmitter<number>();

  currentValue!: number;
  displayValue: string = '';
  animationDirection: 'left' | 'right' | null = null;

  private readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  private readonly currentYear = new Date().getFullYear();
  private holdTimeout: any;
  private holdInterval: any;
  private mouseIsDown: boolean = false;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.currentValue = this.initialValue;
    this.updateDisplayValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValue'] && !changes['initialValue'].firstChange) {
      this.currentValue = changes['initialValue'].currentValue;
      this.updateDisplayValue();
    }
  }

  get isNextDisabled(): boolean {
    if (this.mode === 'year') {
      return this.currentValue >= this.currentYear;
    }
    return false;
  }

  startChange(direction: 'next' | 'previous'): void {
    this.mouseIsDown = true;
    const action = direction === 'next'
      ? () => this.incrementValue()
      : () => this.decrementValue();

    action();

    this.holdTimeout = setTimeout(() => {
      this.holdInterval = setInterval(action, 400);
    }, 400);
  }

  stopChange(): void {
    clearTimeout(this.holdTimeout);
    clearInterval(this.holdInterval);
    if (this.mouseIsDown) {
      this.valueChange.emit(this.currentValue);
    }
    this.mouseIsDown = false;
  }

  private decrementValue(): void {
    if (this.mode === 'year') {
      this.currentValue--;
    } else {
      this.currentValue = (this.currentValue - 1 + 12) % 12;
    }
    this.updateDisplayAndAnimation('left');
  }

  private incrementValue(): void {
    if (this.isNextDisabled) {
      this.stopChange();
      return;
    }

    if (this.mode === 'year') {
      this.currentValue++;
    } else {
      this.currentValue = (this.currentValue + 1) % 12;
    }
    this.updateDisplayAndAnimation('right');
  }

  private updateDisplayAndAnimation(direction: 'left' | 'right'): void {
    this.updateDisplayValue();
    this.animationDirection = direction;

    setTimeout(() => {
      this.animationDirection = null;
      this.cdr.markForCheck();
    }, 310);

    this.cdr.markForCheck();
  }

  private updateDisplayValue(): void {
    if (this.mode === 'year') {
      this.displayValue = this.currentValue.toString();
    } else {
      this.displayValue = this.monthNames[this.currentValue];
    }
  }
}