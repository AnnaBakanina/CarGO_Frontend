import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(public auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect({
      appState: { target: '/profile' }
    });
  }

  logout() {
    this.auth.logout({});
  }
}
