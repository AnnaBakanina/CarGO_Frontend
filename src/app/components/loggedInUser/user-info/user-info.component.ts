import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userFirstName: string = '';
  userLastName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  originalData: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };
  formChanged: boolean = false;

  private userSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userDetails$.subscribe(user => {
      this.userFirstName = user.firstName;
      this.userLastName = user.lastName;
      this.userEmail = user.email;
      this.userPhone = user.phoneNumber;

      this.originalData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber
      };
    });
  }

  checkForChanges() {
    this.formChanged =
      this.userFirstName !== this.originalData.firstName ||
      this.userLastName !== this.originalData.lastName ||
      this.userEmail !== this.originalData.email ||
      this.userPhone !== this.originalData.phone;
  }

  saveChanges() {
    const updatedUser = {
      ...this.userService.userDetails,
      firstName: this.userFirstName,
      lastName: this.userLastName,
      email: this.userEmail,
      phoneNumber: this.userPhone
    };

    this.userService.userDetails = updatedUser;

    this.userService.updateProfile().subscribe({
      next: () => {
        this.toastr.success('Дані користувача оновлено', 'Готово!');
        this.formChanged = false;
        this.originalData = {
          firstName: this.userFirstName,
          lastName: this.userLastName,
          email: this.userEmail,
          phone: this.userPhone
        };
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Щось пішло не так...', 'Упс!');
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
