import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
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

  constructor(
    private userService: UserService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    this.userFirstName = this.userService.userDetails.firstName;
    this.userLastName = this.userService.userDetails.lastName;
    this.userEmail = this.userService.userDetails.email;
    this.userPhone = this.userService.userDetails.phoneNumber;
    this.originalData = {
      firstName: this.userFirstName,
      lastName: this.userLastName,
      email: this.userEmail,
      phone: this.userPhone
    };
  }

  checkForChanges() {
    this.formChanged =
      this.userFirstName !== this.originalData.firstName ||
      this.userLastName !== this.originalData.lastName ||
      this.userEmail !== this.originalData.email ||
      this.userPhone !== this.originalData.phone;
  }

  saveChanges() {
    this.userService.userDetails.firstName = this.userFirstName;
    this.userService.userDetails.lastName = this.userLastName;
    this.userService.userDetails.email = this.userEmail;
    this.userService.userDetails.phoneNumber = this.userPhone;

    this.userService.updateProfile().subscribe({
      next: (x: any) => {
        console.log(x);
        this.toastr.success('Данні користувача оновлено', 'Готово!');
      },
      error: (err:any) => {
        console.error(err);
        this.toastr.error('Щось пішло не так...', 'Упс!');
      }      
    });

    this.formChanged = false;
    this.originalData = {
      firstName: this.userFirstName,
      lastName: this.userLastName,
      email: this.userEmail,
      phone: this.userPhone
    };
  }
}
