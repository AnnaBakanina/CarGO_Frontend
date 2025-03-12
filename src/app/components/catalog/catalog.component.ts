import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})

export class CatalogComponent {
  filter = { make: '', type: '' };

  vehicles = [
    { make: 'Toyota', model: 'Corolla', type: 'Sedan', image: 'data:image/jpeg;base64,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' },
    { make: 'Ford', model: 'Explorer', type: 'SUV', image: 'https://d2qldpouxvc097.cloudfront.net/image-by-path?bucket=a5-gallery-serverless-prod-chromebucket-1iz9ffi08lwxm&key=450243%2Ffront34%2Flg%2Fe4e4e3' },
    { make: 'Chevrolet', model: 'Silverado', type: 'Truck', image: 'https://i.bstr.es/highmotor/2024/10/Chevrolet-Silverado-EV-2025-00001-1280x715.jpeg' },
    { make: 'Toyota', model: 'Corolla', type: 'Sedan', image: 'data:image/jpeg;base64,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' },
    { make: 'Ford', model: 'Explorer', type: 'SUV', image: 'https://d2qldpouxvc097.cloudfront.net/image-by-path?bucket=a5-gallery-serverless-prod-chromebucket-1iz9ffi08lwxm&key=450243%2Ffront34%2Flg%2Fe4e4e3' },
    { make: 'Chevrolet', model: 'Silverado', type: 'Truck', image: 'https://i.bstr.es/highmotor/2024/10/Chevrolet-Silverado-EV-2025-00001-1280x715.jpeg' }
  ];
}
