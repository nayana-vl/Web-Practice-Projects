import { Routes } from '@angular/router';
import { TrackerComponent } from './pages/tracker.page';

export const routes: Routes = [
  { path: '',       redirectTo: 'tracker', pathMatch: 'full' },
  { path: 'tracker', component: TrackerComponent             },
  { path: '**',     redirectTo: 'tracker'                    }
];
