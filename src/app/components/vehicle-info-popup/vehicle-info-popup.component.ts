import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-info-popup',
  imports: [CommonModule],
  templateUrl: './vehicle-info-popup.component.html',
  styleUrl: './vehicle-info-popup.component.css'
})
export class VehicleInfoPopupComponent {
  @Input() vehicle: any;
  @Input() onClose!: () => void;
}
