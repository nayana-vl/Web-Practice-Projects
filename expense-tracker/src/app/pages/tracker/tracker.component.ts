import { Component } from '@angular/core';
import { TrackerToolbar } from '../../components/tracker-toolbar/tracker-toolbar';
import { GlobalNav } from '../../components/global-nav/global-nav';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';

@Component({
  selector: 'tracker',
  standalone: true,
  imports: [
    TrackerToolbar,
    GlobalNav,
    HomeComponent,
    TableComponent
  ],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss'
})
export class TrackerComponent {

  activeToolbar = 'home';

  switchPanel(panelName: string): void {
    this.activeToolbar = panelName;
  }
}
