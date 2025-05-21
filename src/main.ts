import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideAuth0({
      domain: 'dev-4fswi5dwxm162ljc.us.auth0.com',
      clientId: 'X0dvzi5mFU5Bo4qzRAPNTsIOGNdC94Ze',
      authorizationParams: {
        redirect_uri: window.location.origin + '/home'
        // redirect_uri: window.location.origin + '/profile'
      },
      cacheLocation: 'localstorage'
    })
  ]
}).catch((err) => console.error(err));
