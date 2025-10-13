import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },

  {
    path: 'overview',
    loadComponent: () => import('./components/overview/overview.component')
      .then(m => m.OverviewComponent),
    canActivate: [authGuard]
  },

  {
    path: 'agents/:id',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'alerts', pathMatch: 'full' },
      {
        path: 'alerts',
        loadComponent: () => import('./components/alerts/alerts.component')
          .then(m => m.AlertsComponent)
      },
      {
        path: 'metrics',
        loadComponent: () => import('./components/metrics/metrics.component')
          .then(m => m.MetricsComponent)
      },
      {
        path: 'rules',
        loadComponent: () => import('./components/rule-list/rule-list.component')
          .then(m => m.RuleListComponent)
      }
    ]
  },

  {
    path: 'status',
    loadComponent: () => import('./components/pages/status.component')
      .then(m => m.StatusComponent),
    canActivate: [authGuard]
  }
];