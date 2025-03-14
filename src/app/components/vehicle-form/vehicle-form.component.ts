import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-vehicle-form',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})

export class VehicleFormComponent implements OnInit {
  brands: any[] = [];
  models: any [] = [];
  vehicle: any = {};

  constructor(private brandService: BrandService) {}

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: any) => {
      this.brands = data;
    });
  }

  onBrandChange() {
    var selectedBrand = this.brands.find(m => m.id == this.vehicle.make);
    this.models = selectedBrand ? selectedBrand.carModel: [];
  }
}
