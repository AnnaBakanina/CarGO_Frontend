import { Vehicle } from './../../models/vehicle';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { CarTypeService } from '../../services/carType.serice';
import { VehicleService } from './../../services/vehicle.service';
import { LocationService } from './../../services/location.service';
import { TechStateService } from './../../services/techState.service';
import { Region } from '../../models/region';
import { VehicleInfoPopupComponent } from '../vehicle-info-popup/vehicle-info-popup.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleInfoPopupComponent, PaginationComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})

export class CatalogComponent implements OnInit {
  query: any = {
    brandId: null,
    modelId: null,
    carTypeId: null,
    priceFrom: null,
    priceTo: null,
    carMileageFrom: null,
    carMileageTo: null,
    regionId: null,
    cityId: null,
    sortBy: null,
    isSortAscending: null,
    page: 1,
    pageSize: 10
  };
  brands: any[] = [];
  models: any [] = [];
  carTypes: any[] = [];
  techState: any[] = [];
  regions: Region[] = [];
  cities: any[] = [];
  apiVehicles: Vehicle[] = [];
  totalItems: any;

  selectedVehicle: Vehicle | null = null;
  isPopupOpen = false;
  sortOption = '';

  constructor(
    private brandService: BrandService,
    private carTypeService: CarTypeService,
    private techStateService: TechStateService,
    private locationService: LocationService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute
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
    });
  }

  // onBrandChange() {
  //   var selectedBrand = this.brands.find(m => m.id == this.models.id);
  //   this.models = selectedBrand ? selectedBrand.carModel: [];
  //   delete this.vehicle.modelId;
  // }

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
      carTypeId: null,
      priceFrom: null,
      priceTo: null,
      carMileageFrom: null,
      carMileageTo: null,
      regionId: null,
      cityId: null
    };
    this.onApplyFilters();
  }
}
