import { VehicleTableListingComponent } from './../vehicle-table-listing/vehicle-table-listing.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserListingComponent } from '../user-listing/user-listing.component';
// import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, UserListingComponent, RouterModule, VehicleTableListingComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  // user: any = {};
  userName = 'Anna';
  userEmail = 'annatest@test.com'
  
  // constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userService.getUserProfile().subscribe(data => {
  //     this.user = data;
  //   });
  // }
}
