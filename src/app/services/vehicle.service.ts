import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  constructor( private http: HttpClient) { }

  create(vehicle: any) {
    return this.http.post('http://localhost:5269/vehicles', vehicle);
  }
}
