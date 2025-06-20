import { bootstrapApplication } from '@angular/platform-browser';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr(),
    provideAuth0({
      domain: 'dev-4fswi5dwxm162ljc.us.auth0.com',
      clientId: 'X0dvzi5mFU5Bo4qzRAPNTsIOGNdC94Ze',
      authorizationParams: {
        redirect_uri: window.location.origin + '/callback',
        audience: 'https://cargo.com'
      },
      cacheLocation: 'localstorage',
      skipRedirectCallback: true,
      httpInterceptor: {
        allowedList: [
          {
            uri: 'http://localhost:5269/vehicles/*',
            httpMethod: 'PUT',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://cargo.com',
              }
            }
          },
          {
            uri: 'http://localhost:5269/vehicles/*',
            httpMethod: 'DELETE',
            tokenOptions: {
              authorizationParams: {
                audience: 'https://cargo.com',
              }
            }
          }
        ]
      }
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ]
}).catch((err) => console.error(err));
