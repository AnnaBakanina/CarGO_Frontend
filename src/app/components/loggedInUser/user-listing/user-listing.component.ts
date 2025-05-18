import { User } from './../../../models/user';
import { Component } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-listing',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.css'
})

export class UserListingComponent {
  apiVehicles: Vehicle[] = [];
  query: any = {
    userId: null
  };
  totalItems: any;

  listings = [
    { title: 'Listing 1', description: 'Description 1' },
    { title: 'Listing 2', description: 'Description 2' },
    { title: 'Listing 3', description: 'Description 3' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.query.userId = this.userService.userDetails.id;
    this.vehicleService.getAllVehicles(this.query).subscribe((result: any) => {
      this.apiVehicles = result.data;
      this.totalItems = result.totalItems;
    });
  }
}
