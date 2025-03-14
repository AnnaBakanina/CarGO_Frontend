import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BrandService {
  constructor( private http: HttpClient) { }

  getBrands() {
      return this.http.get('http://localhost:5269/car-brands');
  }
}
