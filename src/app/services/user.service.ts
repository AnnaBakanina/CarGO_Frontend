import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '../models/user';
import { BehaviorSubject, filter, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly apiEndpoint = 'http://localhost:5269';
  namespace = 'https://yourdomain.com';

  private userDetailsSubject = new BehaviorSubject<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  userDetails$ = this.userDetailsSubject.asObservable();
  userRole = '';

  get userDetails(): User {
    return this.userDetailsSubject.getValue();
  }
  
  set userDetails(value: User) {
    this.userDetailsSubject.next(value);
  }
    
  constructor(private auth: AuthService, private http: HttpClient) {
    this.auth.isAuthenticated$.pipe(
      filter(isAuth => isAuth !== null),
      switchMap((isAuth) => {
        if (!isAuth) {
          this.userDetailsSubject.next({
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
          });
          this.userRole = '';
          return of(null);
        }
        return this.auth.user$;
      }),
      filter(user => user !== null),
      tap((user: any) => {
        if (user) {
          this.userDetailsSubject.next({
            id: user.sub,
            firstName: user[`${this.namespace}/first_name`] || '',
            lastName: user[`${this.namespace}/last_name`] || '',
            email: user.email || '',
            phoneNumber: user[`${this.namespace}/phone_number`] || '',
          });
      
          this.userRole = user[`${this.namespace}/role`] || '';
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

  isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  isAdmin(): boolean {
    return this.userRole == 'admin';
  }
  
  isAuthenticatedSync(): boolean {
    let isAuth = false;
    this.auth.isAuthenticated$.pipe(take(1)).subscribe(auth => isAuth = auth);
    return isAuth;
  }

  updateProfile(): Observable<any> {
    const data = {
      userId: this.userDetails.id,
      firstName: this.userDetails.firstName,
      lastName: this.userDetails.lastName,
      phoneNumber: this.userDetails.phoneNumber
    };
  
    return this.http.patch<any>(`${this.apiEndpoint}/user/update-profile`, data).pipe(
      tap(() => {
        this.userDetails = { ...this.userDetails };
      })
    );
  }
  
  getUserById(id: string) {
    return this.http.get(`${this.apiEndpoint}/user/${id}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndpoint}/user/all-users`);
  }
}
