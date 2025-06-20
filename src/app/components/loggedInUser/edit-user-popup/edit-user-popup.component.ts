import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-popup.component.html',
  styleUrl: './edit-user-popup.component.css'
})

export class EditUserPopupComponent implements OnChanges {
  @Input() user: User | null = null;
  @Output() onClose = new EventEmitter<void>();

  editableUser: User | null = null;
  originalUser: User | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.originalUser = { ...this.user };
      this.editableUser = { ...this.user };
    }
  }

  closePopup(): void {
    this.onClose.emit();
  }

  saveChanges(){
    if (!this.editableUser) return;

    this.userService.userDetails = {
      ...this.userService.userDetails,
      firstName: this.editableUser.firstName,
      lastName: this.editableUser.lastName,
      email: this.editableUser.email,
      phoneNumber: this.editableUser.phoneNumber
    };
  
    this.userService.updateProfile().subscribe({
      next: () => {
        this.toastr.success('Дані користувача оновлено', 'Готово!');
        this.onClose.emit();
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Щось пішло не так...', 'Упс!');
      }
    });
  }

  isChanged(): boolean {
    return JSON.stringify(this.editableUser) !== JSON.stringify(this.originalUser);
  }
}
