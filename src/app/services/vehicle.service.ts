import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
  private readonly vehicleEndpoint = 'http://localhost:5269/vehicles';
  constructor( private http: HttpClient) { }

  create(vehicle: any) {
    return this.http.post(this.vehicleEndpoint, vehicle);
  }

  getVehicle(id: number) {
    return this.http.get(this.vehicleEndpoint + id); 
  }

  updateVehicle (id: number, body: any) {
    return this.http.put(this.vehicleEndpoint + id, body);
  }

  // getAllVehicles() {
  //   return this.http.get(this.vehicleEndpoint);
  // }

  getAllVehicles(filter: undefined) {
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
