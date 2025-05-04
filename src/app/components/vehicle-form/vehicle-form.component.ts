import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.serice';
import { Region } from '../../models/region';
import { VehicleSave } from '../../models/vehicleSave';

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
  carTypes: any[] = [];
  techState: any[] = [];
  regions: any[] = [];
  cities: any[] = [];
  vehicle: VehicleSave = {
    userId: undefined,
    modelId: 0,
    brandId: 0,
    carTypeId: 0,
    techStateId: 0,
    yearOfRelease: 0,
    vinNumber: '',
    carMileage: 0,
    description: '',
    isAuction: false,
    isPaymentInParts: false,
    isTaxable: false,
    phoneNumber: '',
    regionId: 0,
    cityId: 0,
    price: 0,
    advertisementStatusId: 1
  };

  constructor(
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService
    ) {}

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: any) => {
      this.brands = data;
    });
    this.carTypeService.getCarTypes().subscribe((data: any) => {
      this.carTypes = data;
    });
    this.techStateService.getCarTechState().subscribe((data: any) => {
      this.techState = data;
    });
    this.locationService.getLocation().subscribe((data: any) => {
      this.regions = data;
    });
  }

  onBrandChange() {
    var selectedBrand = this.brands.find(m => m.id == this.vehicle.brandId);
    this.models = selectedBrand ? selectedBrand.carModel: [];
    // delete this.vehicle.modelId;
  }

  onRegionChange() {
    var selectedRegion = this.regions.find(c => c.id == this.vehicle.regionId);
    this.cities = selectedRegion ? selectedRegion.city: [];
    // delete this.vehicle.cityId;
  }

  submit() {
    this.vehicleService.create(this.vehicle)
      .subscribe({
        next: (x: VehicleSave) => {
          console.log(x);
          },
        error: (err:any) => {
          console.error(err);
          }
      });
  }  
}
