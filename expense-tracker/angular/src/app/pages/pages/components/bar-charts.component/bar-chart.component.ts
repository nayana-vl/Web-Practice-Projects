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

  private createChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const canvas = this.barChartCanvas?.nativeElement;
    if (!canvas || !this.data) {
      return;
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
        maintainAspectRatio: true,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.xAxisLabel,
              color: '#676869ff',
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
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
      this.chartInstance.data = this.data as any;
      this.chartInstance.update();
    }
  }
}