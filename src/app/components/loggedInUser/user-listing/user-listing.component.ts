import { Component } from '@angular/core';

@Component({
  selector: 'app-user-listing',
  imports: [],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.css'
})
export class UserListingComponent {
  // listings: any[] = [];
  listings = [
    { title: 'Listing 1', description: 'Description 1' },
    { title: 'Listing 2', description: 'Description 2' },
    { title: 'Listing 3', description: 'Description 3' }
  ];

  // constructor(private listingsService: ListingsService) {}

  // ngOnInit(): void {
  //   this.listingsService.getUserListings().subscribe(data => {
  //     this.listings = data;
  //   });
  // }
}
