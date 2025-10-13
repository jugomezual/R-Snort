import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const goingToLogin = route.routeConfig?.path === 'login';

  if (!auth.isLoggedIn()) {
    if (!goingToLogin) router.navigate(['/login']);
    return goingToLogin;
  }

  if (goingToLogin && auth.isLoggedIn()) {
    router.navigate(['/overview']);
    return false;
  }

  return true;
};
