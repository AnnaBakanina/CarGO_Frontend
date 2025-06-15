import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.serice';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle';
import { VehicleSave } from '../../models/vehicleSave';
import { Brand } from '../../models/brand';
import { Region } from '../../models/region';
import { ToastrService } from 'ngx-toastr';
import { AdvertisementStatusService } from '../../services/advertisementStatus.service';

declare var bootstrap: any;

@Component({
  selector: 'app-vehicle-edit-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-edit-form.component.html',
  styleUrl: './vehicle-edit-form.component.css'
})

export class VehicleEditFormComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  private modalInstance: any;
  
  editForm!: FormGroup;
  brands: Brand[] = [];
  models: any = {};
  carTypes: any = {};
  techState: any = {};
  regions: Region[] = [];
  cities: any = {};
  adStatuses: any = {};
  updateVehicleId = 0;
  selectedBrandId = 0;
  selectedRegionId = 0;
  
  vehicle: VehicleSave = {
    modelId: 0,
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
    cityId: 0,
    price: 0,
    advertisementStatusId: 1
  };

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private advertisementStatusService: AdvertisementStatusService
    ) {}

    ngOnInit(): void {
      this.updateVehicleId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

      const requests: {
        brands: Observable<Brand[]>,
        carTypes: Observable<any>,
        techState: Observable<any>,
        regions: Observable<Region[]>,
        vehicle?: Observable<Vehicle>,
        adStatuses: Observable<any>
      } = {
        brands: this.brandService.getBrands() as Observable<Brand[]>,
        carTypes: this.carTypeService.getCarTypes(),
        techState: this.techStateService.getCarTechState(),
        regions: this.locationService.getLocation() as Observable<Region[]>,
        adStatuses: this.advertisementStatusService.getAdvertisementStatuses()
      };

      this.editForm = this.formBuilder.group({
        modelId: [null, Validators.required],
        carTypeId: [null, Validators.required],
        techStateId: [null, Validators.required],
        yearOfRelease: [null, Validators.required],
        vinNumber: ['', Validators.required],
        carMileage: [null, Validators.required],
        description: [''],
        phoneNumber: ['', Validators.required],
        cityId: [null, Validators.required],
        price: [null, Validators.required],
        advertisementStatusId: [null, Validators.required]
      });
    
      if (this.updateVehicleId) {
        requests.vehicle = this.vehicleService.getVehicle(this.updateVehicleId) as Observable<Vehicle>;
      }
    
      forkJoin(requests).subscribe({
        next: (data: {
          brands: Brand[],
          carTypes: any,
          techState: any,
          regions: Region[],
          vehicle?: Vehicle,
          adStatuses: any
        }) => {
          this.brands = data.brands;
          this.carTypes = data.carTypes;
          this.techState = data.techState;
          this.regions = data.regions;
          if (data.vehicle) {
            this.setVehicle(data.vehicle);
            this.populateModels();
            this.populateCities();
          };
          this.adStatuses = data.adStatuses;
        },
        error: (err: any) => {
          this.router.navigate(['/not-found']);
        }
      });
    }

    onBrandChange() {
      this.populateModels();
      this.selectedBrandId = 0;
    }
  
    onRegionChange() {
      this.populateCities();
      this.selectedRegionId = 0;
    }

    openDeleteModal() {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(this.deleteModal.nativeElement);
      }
      this.modalInstance.show();
    }
  
    closeDeleteModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    }

    confirmDelete() {
      this.vehicleService.delete(this.updateVehicleId).subscribe({
        next: () => {
          this.toastr.success('Оголощення видалено', 'Успіх!');
          this.closeDeleteModal();
          this.router.navigate(['/profile']); // Або куди треба після видалення
        },
        error: () => {
          this.toastr.error('Не вдалося видалити оголошення', 'Помилка');
        }
      });
    }

  private populateModels() {
    var selectedBrand = this.brands.find(m => m.id == this.selectedBrandId);
    this.models = selectedBrand ? selectedBrand.carModel: [];
  }

  private populateCities() {
    var selectedRegion = this.regions.find(c => c.id == this.selectedRegionId);
    this.cities = selectedRegion ? selectedRegion.city: [];
  }
  
  private setVehicle(v: Vehicle) {
    this.vehicle.modelId = v.model.id;
    this.vehicle.carTypeId = Number(v.carType.id);
    this.selectedBrandId = v.brand.id;
    this.vehicle.techStateId = v.techState.id;
    this.vehicle.yearOfRelease = v.yearOfRelease;
    this.vehicle.vinNumber = v.vinNumber;
    this.vehicle.carMileage = v.carMileage;
    this.vehicle.description = v.description;
    this.vehicle.isAuction = v.isAuction;
    this.vehicle.isPaymentInParts = v.isPaymentInParts;
    this.vehicle.isTaxable = v.isTaxable;
    this.vehicle.price = v.price;
    this.vehicle.phoneNumber = v.phoneNumber;
    this.selectedRegionId = v.region.id;
    this.vehicle.cityId = v.city.id;
    this.vehicle.advertisementStatusId = v.advertisementStatus.id;
  }

  // delete() {
  //   if (confirm("Ви впевнені?"))
  //     this.vehicleService.delete(this.updateVehicleId);
  // }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      this.toastr.success('Оголошення оновлено.', 'Готово!');
      console.log('Form Submitted:', this.editForm.value);
    } else {
      this.editForm.markAllAsTouched();
      this.toastr.info('Всі поля мають бути заповнені.', 'Увага!');
      console.log('Form is invalid');
    }
  }
}
