import { Component } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-table-listing',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-table-listing.component.html',
  styleUrl: './vehicle-table-listing.component.css'
})
export class VehicleTableListingComponent {
  filters = {
    brand: '',
    model: '',
    vin: ''
  };

  constructor(
    private vehicleService: VehicleService
  ) {}
  
  vehicles: Vehicle[] = [];
  paginatedVehicles: Vehicle[] = [];
  
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  sortColumn: keyof Vehicle | null = null;
  sortAsc = true;
  
  ngOnInit() {
    this.vehicleService.getAllVehicles().subscribe((data: any) => {
      this.vehicles = data;
      this.applyFilters();
    });
  }
  
  applyFilters() {
    let filtered = this.vehicles.filter(v =>
      (!this.filters.brand || v.brand.name.toLowerCase().includes(this.filters.brand.toLowerCase())) &&
      (!this.filters.model || v.model.name.toLowerCase().includes(this.filters.model.toLowerCase())) &&
      (!this.filters.vin || v.vinNumber.toLowerCase().includes(this.filters.vin.toLowerCase()))
    );
  
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[this.sortColumn!] ?? 0;
        const valB = b[this.sortColumn!] ?? 0;
        if (typeof valA === 'string') {
          return this.sortAsc
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }
        return this.sortAsc ? +valA - +valB : +valB - +valA;
      });
    }
  
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedVehicles = filtered.slice(start, start + this.itemsPerPage);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }
  
  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }
  
  sortData(column: keyof Vehicle) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
    this.applyFilters();
  }
  
  // // Мокові дані
  // getMockData(): Vehicle[] {
  //   return [
  //     {
  //       id: 1,
  //       user: undefined,
  //       brand: {id: 7, name:'Toyota'},
  //       model: {id:5, name:'Corolla'},
  //       carType: {id:9, name:'Sedan'},
  //       techState: {id:5, name: 'New'},
  //       yearOfRelease: 2022,
  //       vinNumber: 'ABC123KDFVKLD78',
  //       carMileage: 0,
  //       description: 'Ця властивість дозволяє автоматично переносити слова, якщо вони не вміщуються в одну клітинку.',
  //       isAuction: false,
  //       isPaymentInParts: false,
  //       isTaxable: true,
  //       phoneNumber: '+380991234567',
  //       region: {id: 7, name:'Lvivska'},
  //       city: {id: 9, name:'Lviv'},
  //       price: 20000,
  //       advertisementStatus: {id: 1, name: 'Active'}
  //     },
  //     // ...додай ще
  //   ];
  // }
}
