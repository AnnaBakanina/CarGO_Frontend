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

  getVehicle(id: number) {
    return this.http.get('http://localhost:5269/vehicles/' + id); 
  }

  updateVehicle (id: number, body: any) {
    return this.http.put('http://localhost:5269/vehicles/' + id, body);
  }

  delete(id: number) {
    return this.http.delete('http://localhost:5269/vehicles/' + id)
  }
}
