import { NavigationComponent } from './components/navigation/navigation.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'vehicle/new', loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent) },
    { path: 'vehicle/:id', loadComponent: () => import('./components/vehicle-edit-form/vehicle-edit-form.component').then(m => m.VehicleEditFormComponent) },
    { path: 'catalog', loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    { path: 'profile', loadComponent: () => import('./components/loggedInUser/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
    { path: 'profile/edit', loadComponent: () => import('./components/loggedInUser/edit-user/edit-user.component').then(m => m.EditUserComponent) },
    { path: 'profile/admin', loadComponent: () => import('./components/admin/admin-form/admin-form.component').then(m => m.AdminFormComponent) }
];
