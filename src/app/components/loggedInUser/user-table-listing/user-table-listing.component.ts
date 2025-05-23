import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { EditUserPopupComponent } from '../edit-user-popup/edit-user-popup.component';

@Component({
  selector: 'app-user-table-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, EditUserPopupComponent],
  templateUrl: './user-table-listing.component.html',
  styleUrl: './user-table-listing.component.css'
})
export class UserTableListingComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  sortColumn: keyof User | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  selectedVehicle: User | null = null;
  isPopupOpen = false;
  sortOption = '';

  columns: { key: keyof User, label: string }[] = [
    { key: 'firstName', label: "Ім'я" },
    { key: 'lastName', label: 'Прізвище' },
    { key: 'email', label: 'Пошта' },
    { key: 'phoneNumber', label: 'Номер телефону' },
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((rawUsers: any[]) => {
      this.users = rawUsers.map(u => ({
        id: u.user_id,
        firstName: u.user_metadata?.first_name || '',
        lastName: u.user_metadata?.last_name || '',
        email: u.email,
        phoneNumber: u.user_metadata?.phone_number || '',
      }));
    });
  }

  get filteredUsers() {
    let result = [...this.users];

    if (this.searchTerm.trim()) {
      result = result.filter(user =>
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.sortColumn) {
      result.sort((a, b) => {
        const valA = a[this.sortColumn as keyof User]?.toString().toLowerCase() || '';
        const valB = b[this.sortColumn as keyof User]?.toString().toLowerCase() || '';
        const compare = valA.localeCompare(valB);
        return this.sortDirection === 'asc' ? compare : -compare;
      });
    }

    return result;
  }

  openPopup(vehicle: User) {
    this.selectedVehicle = vehicle;
    this.isPopupOpen = true;
  }
  
  closePopup() {
    this.isPopupOpen = false;
    this.selectedVehicle = null;
  }

  sortBy(column: keyof User) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  // onEdit(user: User) {
  //   // TODO: відкрити форму або модалку для редагування
  //   console.log('Редагувати користувача:', user);
  // }
}
