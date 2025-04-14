import { NotFoundPageComponent } from './components/errorPages/not-found-page/not-found-page.component';
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
    { path: 'profile/admin', loadComponent: () => import('./components/admin/admin-form/admin-form.component').then(m => m.AdminFormComponent) },
    { path: 'not-found', loadComponent: () => import('./components/errorPages/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent) },
    { path: 'contact', loadComponent: () => import('./components/contact-page/contact-page.component').then(m => m.ContactPageComponent) },
    { path: 'blog', loadComponent: () => import('./components/blog-page/blog-page.component').then(m => m.BlogPageComponent) },
    { path: 'sign-up', loadComponent: () => import('./components/sign-up-form/sign-up-form.component').then(m => m.SignUpFormComponent) }
];
