import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  constructor( private http: HttpClient) { }

  getLocation() {
      return this.http.get('http://localhost:5269/regions');
  }
}
