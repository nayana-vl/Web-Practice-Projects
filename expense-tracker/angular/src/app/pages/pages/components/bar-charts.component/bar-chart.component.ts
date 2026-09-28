import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface ChartJsData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
    borderRadius?: number;
  }[];
}

@Component({
  selector: 'bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() data!: ChartJsData;
  @Input() chartTitle: string = '';
  @Input() xAxisLabel: string = 'Amount (₹)';
  @Input() tooltipPrefix: string = '₹';

  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartScrollWrapper') chartScrollWrapper!: ElementRef<HTMLDivElement>;

  private chartInstance: any;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chartInstance && changes['data']) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  // 🔑 Dynamically compute chart height based on number of bars,
  // so each label+bar gets enough vertical space and never gets squeezed/hidden.
  private computeChartHeight(): number {
    const itemCount = this.data?.labels?.length || 0;
    const perItemHeight = 40; // px per bar, tweak as needed
    const minHeight = 260;
    return Math.max(minHeight, itemCount * perItemHeight);
  }

  private createChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const canvas = this.barChartCanvas?.nativeElement;
    if (!canvas || !this.data) {
      return;
    }

    // Set explicit pixel height on the canvas's parent so Chart.js has a real
    // scrollable area to render all bars/labels without shrinking them.
    const computedHeight = this.computeChartHeight();
    if (this.chartScrollWrapper?.nativeElement) {
      this.chartScrollWrapper.nativeElement.style.height = `${computedHeight}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: this.data as any,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false, // 🔑 must be false so our explicit container height controls sizing
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.xAxisLabel,
              color: '#676869ff',
            }
          },
          y: {
            ticks: {
              autoSkip: false, // 🔑 prevents Chart.js from hiding/skipping labels when space is tight
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              // 🔑 explicitly show the item name (y-axis label) as tooltip title
              title: (context: any) => context[0]?.label || '',
              label: (context: any) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.x !== null) {
                  label += `${this.tooltipPrefix}${context.parsed.x.toFixed(2)}`;
                }
                return label;
              }
            }
          }
        },
      }
    });
  }

  private updateChart(): void {
    if (this.chartInstance) {
      const computedHeight = this.computeChartHeight();
      if (this.chartScrollWrapper?.nativeElement) {
        this.chartScrollWrapper.nativeElement.style.height = `${computedHeight}px`;
      }
      this.chartInstance.data = this.data as any;
      this.chartInstance.resize();
      this.chartInstance.update();
    }
  }
}