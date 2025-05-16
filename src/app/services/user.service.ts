import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '../models/user';
import { of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  namespace = 'https://yourdomain.com';
  userDetails: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };
  userRole = '';
  
  // private managementToken = '';
    
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

  updateProfile() {
    const data = {
      userId: this.userDetails.id,
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      phoneNumber: this.userDetails.phoneNumber
    };
  
    this.http.patch('/user/update-profile', data).subscribe({
      next: res => console.log('Оновлено!'),
      error: err => console.error(err)
    });
  }

  // updateUserMetadata(newMetadata: any) {
  //   return this.getAccessTokenForManagementApi().pipe(
  //     switchMap(token => {
  //       const headers = new HttpHeaders({
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       });

  //       const body = {
  //         user_metadata: newMetadata
  //       };

  //       return this.http.patch(
  //         `https://YOUR_DOMAIN/api/v2/users/${this.userDetails.id}`,
  //         body,
  //         { headers }
  //       );
  //     })
  //   );
  // }

  // private getAccessTokenForManagementApi() {
  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'client_credentials');
  //   body.set('client_id', 'YOUR_CLIENT_ID'); // client з доступом до Management API
  //   body.set('client_secret', 'YOUR_CLIENT_SECRET');
  //   body.set('audience', 'https://YOUR_DOMAIN/api/v2/');

  //   return this.http.post<any>(
  //     `https://YOUR_DOMAIN/oauth/token`,
  //     body.toString(),
  //     {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  //     }
  //   ).pipe(
  //     tap(res => this.managementToken = res.access_token),
  //     switchMap(res => of(res.access_token))
  //   );
  // }
}
