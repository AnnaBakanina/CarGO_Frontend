import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'vehicle/new', loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent) },
    { path: 'vehicle/:id', loadComponent: () => import('./components/vehicle-edit-form/vehicle-edit-form.component').then(m => m.VehicleEditFormComponent) },
    { path: 'catalog', loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent) },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { path: 'profile', loadComponent: () => import('./components/loggedInUser/user-profile/user-profile.component').then(m => m.UserProfileComponent), canActivate: [authGuard] },
    { path: 'profile/edit', loadComponent: () => import('./components/loggedInUser/edit-user/edit-user.component').then(m => m.EditUserComponent), canActivate: [authGuard] },
    { path: 'profile/admin', loadComponent: () => import('./components/admin/admin-form/admin-form.component').then(m => m.AdminFormComponent), canActivate: [adminGuard] },
    { path: 'not-found', loadComponent: () => import('./components/errorPages/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent) },
    { path: 'contact', loadComponent: () => import('./components/contact-page/contact-page.component').then(m => m.ContactPageComponent) },
    { path: 'callback', loadComponent: () => import('./components/shared/callback/callback.component').then(m => m.CallbackComponent) },
    { path: '**', redirectTo: '/not-found' }
];
