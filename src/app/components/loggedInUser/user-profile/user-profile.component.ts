import { VehicleTableListingComponent } from './../vehicle-table-listing/vehicle-table-listing.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserListingComponent } from '../user-listing/user-listing.component';
import { UserInfoComponent } from '../user-info/user-info.component';
import { AdminFormComponent } from '../../admin/admin-form/admin-form.component';
import { UserTableListingComponent } from '../user-table-listing/user-table-listing.component';
// import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserListingComponent, RouterModule, VehicleTableListingComponent, UserInfoComponent, AdminFormComponent, UserTableListingComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  // user: any = {};
  userName = 'Anna';
  userEmail = 'annatest@test.com';
  activeTab: string = 'info';
  
  // constructor(private userService: UserService) {}

  setTab(tab:string) {
    this.activeTab = tab;
  }

  // ngOnInit(): void {
  //   this.userService.getUserProfile().subscribe(data => {
  //     this.user = data;
  //   });
  // }
}
