import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, take } from 'rxjs';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
        console.log('AuthGuard - користувач аутентифікований:', isAuthenticated);
      if (!isAuthenticated) {
        localStorage.setItem('auth_redirect_url', router.url);
        auth.loginWithRedirect();
        return false;
      }
      return true;
    })
  );
};