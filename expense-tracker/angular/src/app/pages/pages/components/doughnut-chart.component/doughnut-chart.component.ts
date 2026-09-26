import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartJsData } from '../bar-charts.component/bar-chart.component';

Chart.register(...registerables);

@Component({
  selector: 'doughnut-chart',
  standalone: true,
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent implements OnDestroy, AfterViewInit, OnChanges {
  @Input() data!: ChartJsData;
  @Input() centerText: string = '';
  @Input() chartTitle: string = '';
  @Input() tooltipPrefix: string = '₹';

  @ViewChild('doughnutChartCanvas') doughnutChartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: any;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chartInstance && (changes['data'] || changes['centerText'])) {
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

    const canvas = this.doughnutChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        const text = this.centerText;
        if (!text) {
          return;
        }

        ctx.restore();
        const fontSize = (height / 120).toFixed(2);
        ctx.font = `bold ${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#676869ff';

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    };

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: this.data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context: any) => {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += `${this.tooltipPrefix}${context.parsed.toFixed(2)}`;
                }
                return label;
              }
            }
          }
        },
      },
      plugins: [centerTextPlugin]
    });
  }

  private updateChart(): void {
    if (this.chartInstance) {
      this.chartInstance.data = this.data as any;
      this.chartInstance.update();
    }
  }
}
