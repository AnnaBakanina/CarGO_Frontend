import { PhotoService } from './../../services/photo.service';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.service';
import { Region } from '../../models/region';
import { VehicleSave } from '../../models/vehicleSave';
import { Vehicle } from '../../models/vehicle';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit {
  brands: any[] = [];
  models: any[] = [];
  carTypes: any[] = [];
  techState: any[] = [];
  regions: any[] = [];
  cities: any[] = [];
  
  vehicleForm!: FormGroup;
  initialFormValue: any;
  
  step = 1;
  createdAdId: number | null = null;
  selectedFile: File | null = null;
  updateProgressBar = 0;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private userService: UserService,
    private photoService: PhotoService,
    private auth: AuthService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadData();
    this.setUserId();
    this.updateProgress();
    
    // Підписка на зміни бренду
    this.vehicleForm.get('brandId')?.valueChanges.subscribe(brandId => {
      if (brandId) {
        this.onBrandChange(brandId);
      }
    });

    // Підписка на зміни регіону
    this.vehicleForm.get('regionId')?.valueChanges.subscribe(regionId => {
      if (regionId) {
        this.onRegionChange(regionId);
      }
    });

    // Зберігаємо початкові значення форми
    this.initialFormValue = this.vehicleForm.value;
  }

  initializeForm() {
    this.vehicleForm = this.fb.group({
      userId: [''],
      carTypeId: [0, Validators.required],
      brandId: [0, Validators.required],
      modelId: [0, Validators.required],
      yearOfRelease: [null, [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
        Validators.min(1900),
        Validators.max(this.currentYear)
      ]],
      vinNumber: ['', [
        Validators.required,
        Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/i)
      ]],
      carMileage: [null, [
        Validators.required,
        Validators.min(0)
      ]],
      techStateId: [0, Validators.required],
      description: ['', [
        Validators.required,
        Validators.maxLength(2000)
      ]],
      price: [null, [
        Validators.required,
        Validators.min(0)
      ]],
      isAuction: [false],
      isTaxable: [false],
      isPaymentInParts: [false],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\+380\d{9}$/)
      ]],
      regionId: [0, Validators.required],
      cityId: [0, Validators.required],
      advertisementStatusId: [1]
    });
  }

  loadData() {
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

  setUserId() {
    if (this.userService.isAuthenticated()) {
      this.vehicleForm.patchValue({ userId: this.userService.userDetails.id });
    }

    this.auth.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth && this.userService.userDetails.id) {
        this.vehicleForm.patchValue({ userId: this.userService.userDetails.id });
      }
    });
  }

  updateProgress() {
    this.updateProgressBar = this.step === 1 ? 50 : 100;
  }

  onBrandChange(brandId: number) {
    const selectedBrand = this.brands.find(m => m.id == brandId);
    this.models = selectedBrand ? selectedBrand.carModel : [];
    this.vehicleForm.patchValue({ modelId: 0 });
  }

  onRegionChange(regionId: number) {
    const selectedRegion = this.regions.find(c => c.id == regionId);
    this.cities = selectedRegion ? selectedRegion.city : [];
    this.vehicleForm.patchValue({ cityId: 0 });
  }

  // Метод для перевірки чи форма була змінена
  isFormChanged(): boolean {
    return JSON.stringify(this.vehicleForm.value) !== JSON.stringify(this.initialFormValue);
  }

  // Метод для перевірки чи форма валідна і змінена
  canSave(): boolean {
    return this.vehicleForm.valid && this.isFormChanged();
  }

  // Маска для телефону
  onPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0 && !value.startsWith('380')) {
      if (value.startsWith('0')) {
        value = '380' + value.substring(1);
      } else {
        value = '380' + value;
      }
    }
    
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '+' + value;
    }
    
    this.vehicleForm.patchValue({ phoneNumber: formattedValue });
  }

  // Форматування ціни з валютою
  onPriceInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    this.vehicleForm.patchValue({ price: value ? parseInt(value) : null });
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('uk-UA') + ' ₴' : '';
  }

  // Підрахунок символів для опису
  getDescriptionLength(): number {
    return this.vehicleForm.get('description')?.value?.length || 0;
  }

  getRemainingDescriptionLength(): number {
    return 2000 - this.getDescriptionLength();
  }

  // Валідація для числових полів (тільки позитивні числа)
  onNumberInput(event: any, fieldName: string) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    
    if (fieldName === 'yearOfRelease' && value.length > 4) {
      value = value.substring(0, 4);
    }
    
    this.vehicleForm.patchValue({ [fieldName]: value ? parseInt(value) : null });
  }

  // Валідація VIN номера
  onVinInput(event: any) {
    let value = event.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (value.length > 17) {
      value = value.substring(0, 17);
    }
    this.vehicleForm.patchValue({ vinNumber: value });
  }

  resetForm() {
    this.vehicleForm.reset();
    this.initializeForm();
    this.setUserId();
    this.models = [];
    this.cities = [];
    this.step = 1;
    this.createdAdId = null;
    this.selectedFile = null;
    this.initialFormValue = this.vehicleForm.value;
  }

  updateAd() {
    if (!this.createdAdId || !this.vehicleForm.valid) return;

    const vehicleData: VehicleSave = this.vehicleForm.value;
    
    this.vehicleService.updateVehicle(this.createdAdId, vehicleData).subscribe({
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
    if (!this.vehicleForm.valid) return;

    const vehicleData: VehicleSave = this.vehicleForm.value;
    
    this.vehicleService.create(vehicleData).subscribe({
      next: (x: Vehicle) => {
        console.log('Оголошення створено. Тепер завантажте фото.');
        this.createdAdId = x.id;
        this.step = 2;
        this.updateProgress();
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
    } else {
      this.resetForm();
    }
  }

  // Геттери для зручності доступу до полів форми
  get carTypeId() { return this.vehicleForm.get('carTypeId'); }
  get brandId() { return this.vehicleForm.get('brandId'); }
  get modelId() { return this.vehicleForm.get('modelId'); }
  get yearOfRelease() { return this.vehicleForm.get('yearOfRelease'); }
  get vinNumber() { return this.vehicleForm.get('vinNumber'); }
  get carMileage() { return this.vehicleForm.get('carMileage'); }
  get techStateId() { return this.vehicleForm.get('techStateId'); }
  get description() { return this.vehicleForm.get('description'); }
  get price() { return this.vehicleForm.get('price'); }
  get phoneNumber() { return this.vehicleForm.get('phoneNumber'); }
  get regionId() { return this.vehicleForm.get('regionId'); }
  get cityId() { return this.vehicleForm.get('cityId'); }
}