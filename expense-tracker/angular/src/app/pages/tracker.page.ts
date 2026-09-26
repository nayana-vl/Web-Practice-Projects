import { Component } from '@angular/core';
import { TrackerToolbar } from '../components/tracker-toolbar/tracker-toolbar';
import { GlobalNav } from '../components/global-nav/global-nav';
import { HomeComponent } from './pages/home/home.page';
import { TableComponent } from './pages/table/table.page';
import { ChartsComponent } from './pages/charts/charts.page';

@Component({
  selector: 'tracker',
  standalone: true,
  imports: [
    TrackerToolbar,
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

  switchPanel(panelName: string): void {
    this.activeToolbar = panelName;
  }
}
