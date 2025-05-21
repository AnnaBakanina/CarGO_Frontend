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
  filters: any = {
    brand: '',
    model: '',
    vin: ''
  };
  vehicles: Vehicle[] = [];
  paginatedVehicles: Vehicle[] = [];

  columns: { key: keyof Vehicle, label: string }[] = [
    { key: 'id', label: "ID" },
    { key: 'brand', label: 'Бренд' },
    { key: 'model', label: 'Модель' },
    { key: 'vinNumber', label: 'VIN номер' }
  ];

  constructor(
    private vehicleService: VehicleService
  ) {}
  
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  sortColumn: keyof Vehicle | null = null;
  sortAsc = true;
  sortDirection: 'asc' | 'desc' = 'asc';
  
  ngOnInit() {
    console.log(`VEHICLE LIST 1: ${this.vehicleService.getAllVehicles(this.filters)}`);
    this.vehicleService.getAllVehicles(this.filters).subscribe((data: any) => {
      console.log(`VEHICLE LIST 2: ${data}`);
      this.vehicles = data.map((v: any) => ({
        id: v.id,
        brand: v.brand.name,
        model: v.model.name,
        vinNumber: v.vinNumber
      }));
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

  onEdit(vehicle: Vehicle) {
    // TODO: відкрити форму або модалку для редагування
    console.log('Редагувати користувача:', vehicle);
  }
}
