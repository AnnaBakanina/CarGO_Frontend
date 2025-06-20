import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AdvertisementStatusService {
  constructor( private http: HttpClient) { }

  getAdvertisementStatuses() {
      return this.http.get('http://localhost:5269/advertisement-statuses');
  }
}