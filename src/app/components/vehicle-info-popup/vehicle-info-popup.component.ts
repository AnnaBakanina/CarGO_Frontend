import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-info-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-info-popup.component.html',
  styleUrl: './vehicle-info-popup.component.css'
})
export class VehicleInfoPopupComponent {
  @Input() vehicle: any;
  @Output() onClose = new EventEmitter<void>();

  closePopup(): void {
    this.onClose.emit();
  }
}
