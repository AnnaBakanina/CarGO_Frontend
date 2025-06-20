import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, map, take } from 'rxjs';

export const adminGuard = () => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return combineLatest([
    authService.isAuthenticated$,
    userService.userDetails$
  ]).pipe(
    take(1),
    map(([isAuth, userDetails]) => {
      if (!isAuth) {
        localStorage.setItem('auth_redirect_url', router.url);
        authService.loginWithRedirect();
        return false;
      }
      
      if (!userService.isAdmin()) {
        router.navigate(['/home']);
        return false;
      }
      
      return true;
    })
  );
};