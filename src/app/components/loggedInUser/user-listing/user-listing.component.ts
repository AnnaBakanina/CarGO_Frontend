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
    {
      title: 'Title 1',
      description: 'Description1'
    },
    {
      title: 'Title 2',
      description: 'Description2'
    },
    {
      title: 'Title 3',
      description: 'Description3'
    }
  ];

  // constructor(private listingsService: ListingsService) {}

  // ngOnInit(): void {
  //   this.listingsService.getUserListings().subscribe(data => {
  //     this.listings = data;
  //   });
  // }
}
