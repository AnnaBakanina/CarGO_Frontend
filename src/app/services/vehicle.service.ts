import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VehicleSave } from '../models/vehicleSave';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  private readonly vehicleEndpoint = 'http://localhost:5269/vehicles/';
  constructor( private http: HttpClient) { }

  create(vehicle: VehicleSave): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.vehicleEndpoint, vehicle);
  }

  getVehicle(id: number) {
    return this.http.get(this.vehicleEndpoint + id); 
  }

  updateVehicle (id: number, body: VehicleSave) {
    return this.http.put(this.vehicleEndpoint + id, body);
  }

  getAllVehicles(filter: any = {}) {
    return this.http.get(this.vehicleEndpoint + '?' + this.toQueryString(filter));
  }

  toQueryString(obj: any) {
    var parts = [];
    for(var property in obj) {
      var value = obj[property];
      if (value !== null && value !== undefined)
       parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value))
    }

    return parts.join('&');
  }

  delete(id: number) {
    return this.http.delete(this.vehicleEndpoint + id)
  }
}
