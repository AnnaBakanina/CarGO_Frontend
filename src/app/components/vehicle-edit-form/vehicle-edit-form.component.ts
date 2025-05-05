import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.serice';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle';
import { VehicleSave } from '../../models/vehicleSave';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-vehicle-edit-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-edit-form.component.html',
  styleUrl: './vehicle-edit-form.component.css'
})
export class VehicleEditFormComponent implements OnInit {
  editForm!: FormGroup;
  brands: Brand[] = [];
  models: any = {};
  carTypes: any = {};
  techState: any = {};
  regions: any = {};
  cities: any = {};
  updateVehicleId = 22;
  vehicle: VehicleSave = {
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

  isEditingCarType = false;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private router: Router
    ) {}

    ngOnInit(): void {
      const requests: {
        brands: Observable<Brand[]>,
        carTypes: Observable<any>,
        techState: Observable<any>,
        regions: Observable<any>,
        vehicle?: Observable<Vehicle>
      } = {
        brands: this.brandService.getBrands() as Observable<Brand[]>,
        carTypes: this.carTypeService.getCarTypes(),
        techState: this.techStateService.getCarTechState(),
        regions: this.locationService.getLocation()
      };
    
      if (this.updateVehicleId) {
        requests.vehicle = this.vehicleService.getVehicle(this.updateVehicleId) as Observable<Vehicle>;
      }
    
      forkJoin(requests).subscribe({
        next: (data: {
          brands: Brand[],
          carTypes: any,
          techState: any,
          regions: any,
          vehicle?: Vehicle
        }) => {
          this.brands = data.brands;
          this.carTypes = data.carTypes;
          this.techState = data.techState;
          this.regions = data.regions;
          if (data.vehicle) {
            this.setVehicle(data.vehicle);
            this.populateModels();
          };
        },
        error: (err: any) => {
          this.router.navigate(['/not-found']);
        }
      });
    }

    onBrandChange() {
      this.populateModels();
      this.vehicle.brandId = 0;
    }
  
    onRegionChange() {
      this.populateCities();
      this.vehicle.cityId = 0;
    }

  private populateModels() {
    var selectedBrand = this.brands.find(m => m.id == this.vehicle.brandId);
    this.models = selectedBrand ? selectedBrand.carModel: [];
  }

  private populateCities() {
    // var selectedRegion = this.regions.find(c => c.id == this.vehicle.regionId);
    // this.cities = selectedRegion ? selectedRegion.city: [];
  }
  private setVehicle(v: Vehicle) {
    this.vehicle.brandId = v.brand.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.carTypeId = Number(v.carType.id);
    this.vehicle.techStateId = v.techState.id;
    this.vehicle.yearOfRelease = v.yearOfRelease;
    this.vehicle.vinNumber = v.vinNumber;
    this.vehicle.carMileage = v.carMileage;
    this.vehicle.description = v.description;
    this.vehicle.isAuction = v.isAuction;
    this.vehicle.isPaymentInParts = v.isPaymentInParts;
    this.vehicle.isTaxable = v.isTaxable;
    this.vehicle.phoneNumber = v.phoneNumber;
    this.vehicle.regionId = v.region.id;
    this.vehicle.cityId = v.city.id;
  }

  delete() {
    if (confirm("Are you sure?"))
      this.vehicleService.delete(this.updateVehicleId);
  }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      console.log('Form Submitted:', this.editForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
