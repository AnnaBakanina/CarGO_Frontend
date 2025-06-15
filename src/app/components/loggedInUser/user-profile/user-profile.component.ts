import { VehicleTableListingComponent } from './../vehicle-table-listing/vehicle-table-listing.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserListingComponent } from '../user-listing/user-listing.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { AdminFormComponent } from '../../admin/admin-form/admin-form.component';
import { UserTableListingComponent } from '../user-table-listing/user-table-listing.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserListingComponent, RouterModule, VehicleTableListingComponent, UserInfoComponent, AdminFormComponent, UserTableListingComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  activeTab: string = 'info';
  isAdmin: boolean = false;
  userFirstName: string = '';
  userLastName: string = '';
  
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    this.userService.userDetails$.subscribe(user => {
      this.userFirstName = user.firstName;
      this.userLastName = user.lastName;
    });  
  }
  
  get userFullName(): string {
    return `${this.userFirstName} ${this.userLastName}`;
  }

  setTab(tab:string) {
    this.activeTab = tab;
  }
}
