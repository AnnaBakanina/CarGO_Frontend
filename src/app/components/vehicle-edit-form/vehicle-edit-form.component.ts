import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle';
import { VehicleSave } from '../../models/vehicleSave';
import { Brand } from '../../models/brand';
import { Region } from '../../models/region';
import { ToastrService } from 'ngx-toastr';
import { AdvertisementStatusService } from '../../services/advertisementStatus.service';
import { UserService } from '../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-vehicle-edit-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-edit-form.component.html',
  styleUrl: './vehicle-edit-form.component.css'
})
export class VehicleEditFormComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  private modalInstance: any;
  editForm!: FormGroup;
  initialFormValue: any;

  brands: Brand[] = [];
  carTypes: any[] = [];
  techState: any[] = [];
  regions: Region[] = [];
  models: any[] = [];
  cities: any[] = [];
  adStatuses: any[] = [];
  updateVehicleId = 0;
  selectedBrandId = 0;
  selectedRegionId = 0;
  
  descriptionMaxLength = 2000;
  descriptionRemainingChars = this.descriptionMaxLength;

  private previousUrl: string = '';

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
    private advertisementStatusService: AdvertisementStatusService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.updateVehicleId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.previousUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/profile';

    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.editForm = this.formBuilder.group({
      brandId: [null, Validators.required],
      modelId: [null, Validators.required],
      carTypeId: [null, Validators.required],
      techStateId: [null, Validators.required],
      yearOfRelease: ['', [Validators.required, this.yearValidator]],
      vinNumber: ['', [Validators.required, this.vinValidator]],
      carMileage: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(this.descriptionMaxLength)]],
      phoneNumber: ['', [Validators.required, this.phoneValidator]],
      regionId: [null, Validators.required],
      cityId: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      advertisementStatusId: [null, Validators.required],
      isAuction: [false],
      isPaymentInParts: [false],
      isTaxable: [false]
    });

    // Підписуємося на зміни для підрахунку символів в описі
    this.editForm.get('description')?.valueChanges.subscribe(value => {
      this.descriptionRemainingChars = this.descriptionMaxLength - (value?.length || 0);
    });

    // Підписуємося на зміни бренду
    this.editForm.get('brandId')?.valueChanges.subscribe(() => {
      this.onBrandChange();
    });

    // Підписуємося на зміни регіону
    this.editForm.get('regionId')?.valueChanges.subscribe(() => {
      this.onRegionChange();
    });
  }

  private loadData(): void {
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
        this.adStatuses = data.adStatuses;
        
        if (data.vehicle) {
          this.setVehicleData(data.vehicle);
          this.populateModels();
          this.populateCities();
          // Зберігаємо початкові значення форми для порівняння
          this.initialFormValue = this.editForm.value;
        }
      },
      error: (err: any) => {
        this.router.navigate(['/not-found']);
      }
    });
  }

  // Кастомні валідатори
  private yearValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;
    
    const yearString = value.toString();
    if (yearString.length !== 4 || !/^\d{4}$/.test(yearString)) {
      return { 'invalidYear': true };
    }
    
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearString);
    if (year < 1900 || year > currentYear + 1) {
      return { 'yearOutOfRange': true };
    }
    
    return null;
  }

  private vinValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;
    
    if (value.length !== 17) {
      return { 'invalidVin': true };
    }
    
    return null;
  }

  private phoneValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;
    
    // Українські номери телефонів
    const phoneRegex = /^(\+38)?0\d{9}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return { 'invalidPhone': true };
    }
    
    return null;
  }

  // Маска для телефону
  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.startsWith('380')) {
      value = value.substring(2);
    }
    
    if (value.length > 0 && !value.startsWith('0')) {
      value = '0' + value;
    }
    
    // Форматування: 0XX XXX XX XX
    if (value.length > 3) {
      value = value.substring(0, 3) + ' ' + value.substring(3);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + ' ' + value.substring(7);
    }
    if (value.length > 10) {
      value = value.substring(0, 10) + ' ' + value.substring(10, 12);
    }
    
    if (value.length > 13) {
      value = value.substring(0, 13);
    }
    
    this.editForm.patchValue({ phoneNumber: value });
  }

  // Форматування ціни з гривнею
  onPriceInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value) {
      this.editForm.patchValue({ price: parseInt(value) });
    }
  }

  getPriceDisplay(): string {
    const price = this.editForm.get('price')?.value;
    return price ? `${price} ₴` : '';
  }

  // Обмеження введення року
  onYearInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    event.target.value = value;
    this.editForm.patchValue({ yearOfRelease: value });
  }

  // Обмеження введення VIN номера
  onVinInput(event: any): void {
    let value = event.target.value.toUpperCase();
    if (value.length > 17) {
      value = value.substring(0, 17);
    }
    event.target.value = value;
    this.editForm.patchValue({ vinNumber: value });
  }

  // Обмеження пробігу (тільки позитивні числа)
  onMileageInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value) {
      this.editForm.patchValue({ carMileage: parseInt(value) });
    }
  }

  onBrandChange(): void {
    const brandId = this.editForm.get('brandId')?.value;
    this.selectedBrandId = brandId;
    this.populateModels();
    this.editForm.patchValue({ modelId: null });
  }

  onRegionChange(): void {
    const regionId = this.editForm.get('regionId')?.value;
    this.selectedRegionId = regionId;
    this.populateCities();
    this.editForm.patchValue({ cityId: null });
  }

  private populateModels(): void {
    const selectedBrand = this.brands.find(m => m.id == this.selectedBrandId);
    this.models = selectedBrand ? selectedBrand.carModel || [] : [];
  }

  private populateCities(): void {
    const selectedRegion = this.regions.find(c => c.id == this.selectedRegionId);
    this.cities = selectedRegion ? selectedRegion.city || [] : [];
  }

  private setVehicleData(v: Vehicle): void {
    this.selectedBrandId = v.brand.id;
    this.selectedRegionId = v.region.id;
    
    this.editForm.patchValue({
      brandId: v.brand.id,
      modelId: v.model.id,
      carTypeId: Number(v.carType.id),
      techStateId: v.techState.id,
      yearOfRelease: v.yearOfRelease.toString(),
      vinNumber: v.vinNumber,
      carMileage: v.carMileage,
      description: v.description,
      isAuction: v.isAuction,
      isPaymentInParts: v.isPaymentInParts,
      isTaxable: v.isTaxable,
      price: v.price,
      phoneNumber: v.phoneNumber,
      regionId: v.region.id,
      cityId: v.city.id,
      advertisementStatusId: v.advertisementStatus.id
    });
  }

  // Перевірка чи форма була змінена
  isFormChanged(): boolean {
    if (!this.initialFormValue) return false;
    return JSON.stringify(this.editForm.value) !== JSON.stringify(this.initialFormValue);
  }

  // Перевірка чи можна зберегти
  canSave(): boolean {
    return this.editForm.valid && this.isFormChanged();
  }

  openDeleteModal(): void {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.deleteModal.nativeElement);
    }
    this.modalInstance.show();
  }

  closeDeleteModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  confirmDelete(): void {
    this.vehicleService.delete(this.updateVehicleId).subscribe({
      next: () => {
        this.toastr.success('Оголошення видалено', 'Успіх!');
        this.closeDeleteModal();
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.toastr.error('Не вдалося видалити оголошення', 'Помилка');
      }
    });
  }

  onCloseButton(): void {
    this.router.navigate([this.previousUrl]);
  }

  onSubmit(): void {
    if (!this.editForm.valid) {
      this.toastr.info('Всі поля мають бути заповнені правильно.', 'Увага!');
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.isFormChanged()) {
      this.toastr.info('Немає змін для збереження.', 'Увага!');
      return;
    }

    const formValue = this.editForm.value;
    const updatedVehicle: VehicleSave = {
      carTypeId: formValue.carTypeId,
      modelId: formValue.modelId,
      yearOfRelease: parseInt(formValue.yearOfRelease),
      vinNumber: formValue.vinNumber,
      carMileage: formValue.carMileage,
      techStateId: formValue.techStateId,
      description: formValue.description,
      price: formValue.price,
      phoneNumber: formValue.phoneNumber.replace(/\s/g, ''),
      cityId: formValue.cityId,
      advertisementStatusId: formValue.advertisementStatusId,
      isAuction: formValue.isAuction,
      isPaymentInParts: formValue.isPaymentInParts,
      isTaxable: formValue.isTaxable,
      userId: this.userService.userDetails.id
    };

    this.vehicleService.updateVehicle(this.updateVehicleId, updatedVehicle).subscribe({
      next: (res) => {
        this.toastr.success('Оголошення оновлено.', 'Готово!');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.toastr.error('Не вдалося оновити оголошення.', 'Помилка');
        console.error('Update failed', err);
      }
    });
  }

  // Геттери для зручного доступу до полів форми
  get brandId() { return this.editForm.get('brandId'); }
  get carTypeId() { return this.editForm.get('carTypeId'); }
  get modelId() { return this.editForm.get('modelId'); }
  get techStateId() { return this.editForm.get('techStateId'); }
  get yearOfRelease() { return this.editForm.get('yearOfRelease'); }
  get vinNumber() { return this.editForm.get('vinNumber'); }
  get carMileage() { return this.editForm.get('carMileage'); }
  get description() { return this.editForm.get('description'); }
  get phoneNumber() { return this.editForm.get('phoneNumber'); }
  get regionId() { return this.editForm.get('regionId'); }
  get cityId() { return this.editForm.get('cityId'); }
  get price() { return this.editForm.get('price'); }
  get advertisementStatusId() { return this.editForm.get('advertisementStatusId'); }
}