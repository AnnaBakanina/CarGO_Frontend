import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TechStateService {
  constructor( private http: HttpClient) { }

  getCarTechState() {
      return this.http.get('http://localhost:5269/car-tech-state');
  }
}