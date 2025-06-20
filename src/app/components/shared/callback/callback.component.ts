import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-callback',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
      // Перевіряємо чи є код авторизації в URL
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['code'] && params['state']) {
          // Є код авторизації - обробляємо callback
          this.auth.handleRedirectCallback().subscribe({
            next: () => {
              console.log('Auth callback успішний');
              const targetRoute = localStorage.getItem('auth_redirect_url') || '/home';
              localStorage.removeItem('auth_redirect_url');
              this.router.navigate([targetRoute]);
            },
            error: (err) => {
              console.error('Auth callback error:', err);
              this.router.navigate(['/home']);
            }
          });
        } else {
          // Немає коду авторизації - редиректимо на головну сторінку
          console.log('Немає коду авторизації, редирект на home');
          this.router.navigate(['/home']);
        }
      });
    }
}
