import { Component, ChangeDetectionStrategy, input, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LegendItem {
  label: string;
  breakpoint: number;
}

interface HeatmapCell {
  value: number;
  colorIndex: number;
  tooltip: string;
}

@Component({
  selector: 'heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatmapComponent {
  data = input<number[][]>([]);
  weeklyTotals = input<number[]>([]);
  weekLabels = input<string[]>([]);
  title = input<string>('Heatmap');
  yAxisLabels = input<string[]>([]); // column headers (Sun-Sat OR Jan-Dec)
  legendConfig = input<LegendItem[]>([]);
  unit = input<string>('value');

  heatmapMatrix = <HeatmapCell[][]>([]);
  indexOffset = 0;

  // 🔑 Dynamically computes the grid-template-columns based on number of columns
  gridTemplateColumns = computed(() => {
    const columnCount = this.yAxisLabels().length || 7;
    return `minmax(0, 1.6fr) repeat(${columnCount}, minmax(0, 1fr)) minmax(0, 1.2fr)`;
  });

  constructor() {
    effect(() => {
      this.generateDisplayMatrix(this.data());
    });
  }

  private generateDisplayMatrix(matrix: number[][]): void {
    if (!matrix || matrix.length === 0) {
      this.heatmapMatrix = <HeatmapCell[][]>([]);
      return;
    }

    const cellMatrix = matrix.map(row => {
      return row.map(value => ({
        value,
        colorIndex: this.getColorIndexForValue(value),
        tooltip: `${this.unit()}${value.toFixed(2)}`,
      }));
    });

    this.heatmapMatrix = cellMatrix;
  }

  private getColorIndexForValue(value: number): number {
    const config = this.legendConfig();
    this.indexOffset = 7 - config.length;
    const index = config.findIndex(item => value > item.breakpoint);
    if (index !== -1) {
      return index + this.indexOffset;
    }
    return config.length > 0 ? config.length - 1 + this.indexOffset : 0;
  }
}