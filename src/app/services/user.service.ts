import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '../models/user';
import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly apiEndpoint = 'http://localhost:5269';
  namespace = 'https://yourdomain.com';
  userDetails: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };
  userRole = '';
    
  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (!isAuth) return of(null);
        return this.auth.user$;
      }),
      tap((user: any) => {
        if (user) {
          this.userDetails = {
            id: user.sub,
            firstName: user[`${this.namespace}/first_name`] || '',
            lastName: user[`${this.namespace}/last_name`] || '',
            email: user.email || '',
            phoneNumber: user[`${this.namespace}/phone_number`] || '',
          };
          this.userRole = user[`${this.namespace}/role`] || ''
        }
      })
    ).subscribe();
  }

  userLogin() {
    this.auth.loginWithRedirect();
  }

  userLogout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }

  isAdmin(): boolean {
    return this.userRole == 'admin';
  }

  updateProfile(): Observable<any> {
    const data = {
      userId: this.userDetails.id,
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      phoneNumber: this.userDetails.phoneNumber
    };
  
    return this.http.patch<any>(`${this.apiEndpoint}/user/update-profile`, data);
  }
}
