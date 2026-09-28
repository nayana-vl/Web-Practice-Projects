import { Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalNav } from '../components/global-nav/global-nav';
import { HomeComponent } from './pages/home/home.page';
import { TableComponent } from './pages/table/table.page';
import { ChartsComponent } from './pages/charts/charts.page';

@Component({
  selector: 'tracker',
  standalone: true,
  imports: [
    GlobalNav,
    HomeComponent,
    TableComponent,
    ChartsComponent
  ],
  templateUrl: './tracker.page.html',
  styleUrl: './tracker.page.scss'
})
export class TrackerComponent {

  activeToolbar = 'home';

  private readonly tabOrder: string[] = ['home', 'table', 'charts'];

  private touchStartX = 0;
  private touchEndX = 0;
  private readonly swipeThreshold = 50; // minimum px distance to count as a swipe

  switchPanel(panelName: string): void {
    this.activeToolbar = panelName;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX;

    if (Math.abs(deltaX) < this.swipeThreshold) {
      return; // not a significant swipe
    }

    const currentIndex = this.tabOrder.indexOf(this.activeToolbar);

    if (deltaX < 0) {
      // swiped LEFT → go to NEXT tab
      const nextIndex = Math.min(currentIndex + 1, this.tabOrder.length - 1);
      this.activeToolbar = this.tabOrder[nextIndex];
    } else {
      // swiped RIGHT → go to PREVIOUS tab
      const prevIndex = Math.max(currentIndex - 1, 0);
      this.activeToolbar = this.tabOrder[prevIndex];
    }
  }
}