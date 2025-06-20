import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

declare var bootstrap: any;

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
      appState: { target: '/profile' },
      authorizationParams: {
        ui_locales: 'uk'
      }
    });
  }

  logout() {
    this.auth.logout({});
  }

  closeNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse!, { toggle: false });
    bsCollapse.hide();
  }
}
