import { PhotoService } from './../../services/photo.service';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.service';
import { VehicleSave } from '../../models/vehicleSave';
import { Vehicle } from '../../models/vehicle';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';

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
  selectedBrandId = 0;
  selectedRegionId = 0;
  vehicle: VehicleSave = {
    userId: '',
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

  step = 1;
  createdAdId: number | null = null;
  selectedFile: File | null = null;
  updateProgressBar = 0;

  constructor(
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private userService: UserService,
    private photoService: PhotoService,
    private auth: AuthService
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
    if (this.userService.isAuthenticated()) {
      this.vehicle.userId = this.userService.userDetails.id;
    }

    this.auth.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth && this.userService.userDetails.id) {
        this.vehicle.userId = this.userService.userDetails.id;
      }
    });

    this.updateProgress();
  }

  updateProgress() {
    this.updateProgressBar = this.step === 1 ? 50 : 100;

  }

  onBrandChange() {
    var selectedBrand = this.brands.find(m => m.id == this.selectedBrandId);
    this.models = selectedBrand ? selectedBrand.carModel: [];
  }

  onRegionChange() {
    var selectedRegion = this.regions.find(c => c.id == this.selectedRegionId);
    this.cities = selectedRegion ? selectedRegion.city: [];
  }

  resetForm() {
    this.vehicle = {
      userId: '',
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
    this.selectedBrandId = 0;
    this.selectedRegionId = 0;
    this.models = [];
    this.cities = [];
  }

  updateAd() {
    if (!this.createdAdId) return;
  
    this.vehicleService.updateVehicle(this.createdAdId, this.vehicle).subscribe({
      next: (x: Vehicle) => {
        console.log('Оголошення оновлено');
        this.toastr.success('Оголошення оновлено', 'Готово!');
        this.step = 2;
        this.updateProgress();
      },
      error: () => {
        this.toastr.error('Не вдалося оновити оголошення', 'Помилка');
      }
    });
  }
  
  
  createAd() {
    this.vehicleService.create(this.vehicle).subscribe({
      next: (x: Vehicle) => {
        console.log('Оголошення створено. Тепер завантажте фото.');
        this.createdAdId = x.id;
        this.step = 2;
      },
      error: () => {
        console.log('Не вдалося створити оголошення');
      }
    });
  }

  changeTab(goBack: boolean) {
    if (goBack) {
      this.step = 1;
    } else {
      if (this.createdAdId !== null) {
        this.step = 2;
        this.updateAd();
      } else {
        this.step = 2;
        this.createAd();
      }
    }
    this.updateProgress();
  }
  
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.selectedFile = fileInput.files[0];
    }
  }
  
  uploadPhoto() {
    if (!this.selectedFile || !this.createdAdId) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.photoService.upload(formData, this.createdAdId).subscribe({
      next: () => {
        this.toastr.success('Оголошення створено і фото завантажено!', 'Готово');
        this.resetForm();
        this.step = 1;
      },
      error: () => {
        this.toastr.error('Помилка при завантаженні фото', 'Упс...');
      }
    });
  }
  
  cancelAd() {
    if (this.createdAdId) {
      this.vehicleService.delete(this.createdAdId).subscribe({
        next: () => {
          this.toastr.info('Оголошення скасовано', 'Готово');
          this.resetForm();
          this.step = 1;
        },
        error: () => {
          this.toastr.error('Помилка при видаленні', 'Упс...');
        }
      });
    }
  }
}
