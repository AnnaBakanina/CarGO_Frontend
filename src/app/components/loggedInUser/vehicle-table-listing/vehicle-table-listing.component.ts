import { Component } from '@angular/core';
import { Vehicle } from '../../../models/vehicle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-table-listing',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-table-listing.component.html',
  styleUrl: './vehicle-table-listing.component.css'
})

export class VehicleTableListingComponent {
  filters: any = {
    brand: '',
    model: '',
    vin: '',
    page: 1,
    pageSize: 1000
  };
  vehicles: Vehicle[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn: keyof Vehicle | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  columns: { key: keyof Vehicle, label: string }[] = [
    { key: 'id', label: "ID" },
    { key: 'brand', label: 'Бренд' },
    { key: 'model', label: 'Модель' },
    { key: 'vinNumber', label: 'VIN номер' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.vehicleService.getAllVehicles(this.filters).subscribe((results: any) => {
      this.vehicles = results.data;
    });
  }

  get filteredVehicles(): Vehicle[] {
    let result = [...this.vehicles];

    if (this.filters.brand.trim()) {
      result = result.filter(v => v.brand?.name?.toLowerCase().includes(this.filters.brand.toLowerCase()));
    }

    if (this.filters.model.trim()) {
      result = result.filter(v => v.model?.name?.toLowerCase().includes(this.filters.model.toLowerCase()));
    }

    if (this.filters.vin.trim()) {
      result = result.filter(v => v.vinNumber.toLowerCase().includes(this.filters.vin.toLowerCase()));
    }

    if (this.sortColumn) {
      result.sort((a, b) => {
        const valA = a[this.sortColumn as keyof Vehicle]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn as keyof Vehicle]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return result;
  }
  
  get paginatedVehicles(): Vehicle[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVehicles.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  sortData(column: keyof Vehicle) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  onEdit(vehicle: Vehicle) {
    this.router.navigate(['/vehicle', vehicle.id]);
    console.log('Редагувати користувача:', vehicle);
  }
}
