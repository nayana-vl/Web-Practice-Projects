import { Routes } from '@angular/router';
import { TrackerComponent } from './pages/tracker/tracker.component';

export const routes: Routes = [
  { path: '',       redirectTo: 'tracker', pathMatch: 'full' },
  { path: 'tracker', component: TrackerComponent             },
  { path: '**',     redirectTo: 'tracker'                    }
];
