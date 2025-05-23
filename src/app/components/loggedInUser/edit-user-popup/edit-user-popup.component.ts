import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-user-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-popup.component.html',
  styleUrl: './edit-user-popup.component.css'
})

export class EditUserPopupComponent {
  @Input() user: any;
  @Output() onClose = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  closePopup(): void {
    this.onClose.emit();
  }

  saveChanges(){}
}
