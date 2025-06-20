import { Vehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  private readonly photoUploadEndpoint = 'http://localhost:5269';
  constructor( private http: HttpClient) { }

  upload(formData: FormData, vehicleId: number): Observable<any> {
    return this.http.post<any>(this.photoUploadEndpoint + `/vehicle/${vehicleId}/photos`, formData);
  }

  getPhotos(vehicleId: number): Observable<any> {
    return this.http.get<any>(this.photoUploadEndpoint + `/vehicle/${vehicleId}/photos`);
  }
}