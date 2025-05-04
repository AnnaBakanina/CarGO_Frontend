import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
userDetails: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
};
    
    constructor(private auth: AuthService, private http: HttpClient) {}

  userLogin() {
    this.auth.loginWithRedirect();
  }

  userLogout() {
    this.auth.logout();
    // localStorage.removeItem('auth_token');
  }

//   isAuthenticated() {

//   }

  // getUserProfile(): Observable<any> {
    // return this.auth.idToken$.pipe(
    //   switchMap((token) => {
    //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //     return this.http.get('https://your-backend-api.com/profile', { headers });
    //   })
    // );
  // }
}
