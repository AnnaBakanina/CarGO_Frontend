import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.serice';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vehicle-edit-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-edit-form.component.html',
  styleUrl: './vehicle-edit-form.component.css'
})
export class VehicleEditFormComponent implements OnInit {
  editForm!: FormGroup;
  brands: any = {};
  models: any = {};
  carTypes: any = {};
  techState: any = {};
  regions: any = {};
  cities: any = {};
  vehicle: any = {
    id: 12
  };

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    var sources = [
      this.brandService.getBrands(),
      this.carTypeService.getCarTypes(),
      this.techStateService.getCarTechState(),
      this.locationService.getLocation()
    ];

    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id))

    forkJoin(sources).subscribe({
      next: data => {
        this.brands = data[0];
        this.carTypes = data[1];
        this.techState = data[2];
        this.regions = data[3];
        if (this.vehicle.id)
          this.setVehicle(data[4]);
      },
      error: err => { this.router.navigate(['/not-found']) }
    });

    this.vehicleService.getVehicle(this.vehicle.id)
    .subscribe({
      next: v => { this.vehicle = v; },
      error: err => { this.router.navigate(['/not-found']) }
    });
  };

  private setVehicle(v: any) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.brand.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.carTypeId = v.carType.id;
    this.vehicle.techStateId = v.techState.id;
    this.vehicle.yearOfRelease = v.yearOfRelease;
    this.vehicle.vinNumber = v.vinNumber;
    this.vehicle.carMileage = v.carMileage;
    this.vehicle.description = v.description;
    this.vehicle.isAuction = v.isAuction;
    this.vehicle.isPaymentInParts = v.isPaymentInParts;
    this.vehicle.isTaxable = v.isTaxable;
    this.vehicle.phoneNumber = v.phoneNumber;
  }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      console.log('Form Submitted:', this.editForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
