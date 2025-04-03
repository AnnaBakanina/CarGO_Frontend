import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CarTypeService {
  constructor( private http: HttpClient) { }

  getCarTypes() {
      return this.http.get('http://localhost:5269/car-types');
  }
}