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

//   upload(formData: FormData): Observable<any> {
//     return this.http.post<any>(this.photoUploadEndpoint, formData);
//   }

  upload(formData: FormData, vehicleId: number): Observable<any> {
    return this.http.post<any>(this.photoUploadEndpoint + `/vehicle/${vehicleId}/photos`, formData);
  }

  delete(id: number) {
    // return this.http.delete(this.vehicleEndpoint + id)
  }
}