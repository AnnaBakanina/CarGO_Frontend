import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { KeyValuePair } from '../../models/keyValuePair';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../models/brand';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  articles = [
    {
      title: 'Як тестувати Angular-додатки',
      description: 'Основи тестування в Angular: Unit тести, e2e тести...',
      image: 'assets/test-angular.jpg',
      link: '/blog/test-angular'
    },
    {
      title: 'Оптимізація продуктивності',
      description: 'Як зробити Angular-додаток швидшим?',
      image: 'assets/performance.jpg',
      link: '/blog/performance'
    },
    {
      title: 'Робота з API в Angular',
      description: 'Використання HttpClient для роботи з REST API...',
      image: 'assets/api-angular.jpg',
      link: '/blog/api-angular'
    }
  ];
  brands: Brand[] = [];
  selectedBrandId: number = 0;
  models: KeyValuePair[] = [];
  filters = {
    make: '',
    type: '',
    priceFrom: null,
    priceTo: null
  };

  constructor(
    private brandService: BrandService
  ) {}

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: any) => {
      this.brands = data;
    });
  }
  
  // onBrandChange() {
  //   var selectedBrand = this.brands.find(m => m.id == this.models.id);
  //   this.models = selectedBrand ? selectedBrand.carModel: [];
  //   this.modelId = 0;
  // }
}
