import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { KeyValuePair } from '../../models/keyValuePair';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../models/brand';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { Router, RouterModule } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  reviews = [
    {
      name: 'Петро К.',
      description: 'Купівля авто пройшла швидко та без зайвих проблем. Продавець виявився чесним, на всі питання відповів детально, навіть дозволив пройти діагностику на СТО. Машина повністю відповідає опису в оголошенні. Дякую сайту — зручно, просто і надійно.',
      role: 'Покупець'
    },
    {
      name: 'Ганна Б.',
      description: 'Виставив авто на сайт — за два дні вже мав кілька дзвінків і реального покупця. Інтерфейс зрозумілий, можна додати багато фото й опису, а також оновлювати статус оголошення. Рекомендую тим, хто хоче швидко продати своє авто без посередників.',
      role: 'Продавець'
    },
    {
      name: 'Миколай Т.',
      description: 'Зручний сайт для купівлі-продажу автомобілів. Великий вибір, можна фільтрувати за маркою, роком, пробігом та іншими параметрами. Єдине побажання — зробити краще мобільну версію, іноді зависає. В цілому — рекомендую!',
      role: 'Покупець'
    }
  ];

  brands: Brand[] = [];
  selectedBrandId: number = 0;
  models: KeyValuePair[] = [];
  apiVehicles: Vehicle[] = [];
  vehiclesQuery: any = {
    sortBy: 'lastUpdated',
    isSortAscending: false,
    advertisementStatusId: 1,
    page: 1,
    pageSize: 3
  };
  query: any = {
    brandId: null,
    modelId: null,
    priceTo: null
  };

  constructor(
    private brandService: BrandService,
    private vehicleService: VehicleService,
    private router: Router,
    private photoService: PhotoService
  ) {}

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: any) => {
      this.brands = data;
    });
    this.vehicleService.getAllVehicles(this.vehiclesQuery).subscribe((result: any) => {
      this.apiVehicles = result.data;

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
    var selectedBrand = this.brands.find(m => m.id == this.query.brandId);
    this.models = selectedBrand ? selectedBrand.carModel: [];
  }

  onSearchClick() {
    this.router.navigate(['/catalog'], {
      queryParams: this.query
    });
  }
  
}
