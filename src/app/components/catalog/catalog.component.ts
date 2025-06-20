import { PhotoService } from './../../services/photo.service';
import { Vehicle } from './../../models/vehicle';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.service';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { Region } from '../../models/region';
import { VehicleInfoPopupComponent } from '../vehicle-info-popup/vehicle-info-popup.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { NoResultsFoundComponent } from '../errorPages/no-results-found/no-results-found.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleInfoPopupComponent, PaginationComponent, NoResultsFoundComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})

export class CatalogComponent implements OnInit {
  query: any = {
    brandId: null,
    modelId: null,
    carTypeId: null,
    techStateId: null,
    priceFrom: null,
    priceTo: null,
    carMileageFrom: null,
    carMileageTo: null,
    regionId: null,
    cityId: null,
    sortBy: null,
    isSortAscending: null,
    advertisementStatusId: 1,
    page: 1,
    pageSize: 9
  };
  brands: any[] = [];
  models: any [] = [];
  carTypes: any[] = [];
  techState: any[] = [];
  regions: Region[] = [];
  cities: any[] = [];
  apiVehicles: Vehicle[] = [];
  totalItems: any;
  photos: any[] = [];

  selectedVehicle: Vehicle | null = null;
  isPopupOpen = false;
  sortOption = '';

  constructor(
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private photoService: PhotoService
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
    
    this.route.queryParams.subscribe(params => {
      if (params['brandId']) this.query.brandId = +params['brandId'];
      if (params['modelId']) this.query.carTypeId = +params['modelId'];
      if (params['priceTo']) this.query.priceTo = +params['priceTo'];
  
      this.getVehicles();
    });
  }

  private getVehicles() {
    this.vehicleService.getAllVehicles(this.query).subscribe((result: any) => {
      this.apiVehicles = result.data;
      this.totalItems = result.totalItems;

      this.apiVehicles.forEach((vehicle, index) => {
        this.photoService.getPhotos(vehicle.id).subscribe((photos: any[]) => {
          if (photos.length > 0) {
            this.apiVehicles[index].image = `http://localhost:5269/uploads/${photos[0].fileName}`;
          } else {
            this.apiVehicles[index].image = '/default_car.jpg';
          }
        });
      });
    });
  }

  onBrandChange() {
    if (this.query.brandId !== null) {
      const selectedBrand = this.brands.find(b => b.id == this.query.brandId);
      this.models = selectedBrand?.carModel || [];
    } else {
      this.models = [];
    }
    this.query.modelId = null;
  }

  onRegionChange() {
    if (this.query.regionId !== null) {
      const selectedRegion = this.regions.find(r => r.id == this.query.regionId);
      this.cities = selectedRegion?.city || [];
    } else {
      this.cities = [];
    }
    this.query.cityId = null;
  }

  openPopup(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.isPopupOpen = true;
  }
  
  closePopup() {
    this.isPopupOpen = false;
    this.selectedVehicle = null;
  }

  onSortByChange() {
    const [sortBy, direction] = this.sortOption.split('-');
    this.query.sortBy = sortBy;
    this.query.isSortAscending = direction === 'asc';
    this.getVehicles();
  }

  onPageChange(page: number) {
    this.query.page = page;
    this.getVehicles();
  }

  onApplyFilters() {
    this.getVehicles();
  }

  onResetFilter() {
    this.query = {
      brandId: null,
      modelId: null,
      carTypeId: null,
      techStateId: null,
      priceFrom: null,
      priceTo: null,
      carMileageFrom: null,
      carMileageTo: null,
      regionId: null,
      cityId: null,
      sortBy: null,
      isSortAscending: null,
      page: 1,
      pageSize: 9
    };
    this.onApplyFilters();
  }
}
