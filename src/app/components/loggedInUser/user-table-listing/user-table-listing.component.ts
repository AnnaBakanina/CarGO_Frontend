import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-table-listing',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-table-listing.component.html',
  styleUrl: './user-table-listing.component.css'
})
export class UserTableListingComponent {
  users: User[] = [
    { id: '1', firstName: 'Anna', lastName: 'Kowalska', email: 'anna@example.com', phoneNumber: '...' },
    { id: '2', firstName: 'Jan',lastName: 'Nowak', email: 'jan@example.com', phoneNumber: '...' },
    { id: '3', firstName: 'Ola',lastName: 'Wiśniewska', email: 'ola@example.com', phoneNumber: '...' },
  ];

  columns: { key: keyof User, label: string }[] = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
  ];

  sortColumn: keyof User | '' = '';  // Типізуємо sortColumn як ключ одного з полів User
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';

  get filteredUsers() {
    let result = [...this.users];

    // Фільтрація по прізвищу
    if (this.searchTerm.trim()) {
      result = result.filter(user =>
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Сортування
    if (this.sortColumn) {
      result.sort((a, b) => {
        const valA = a[this.sortColumn as keyof User]?.toString().toLowerCase() || '';  // Перевірка, чи є значення та перетворення в рядок
        const valB = b[this.sortColumn as keyof User]?.toString().toLowerCase() || '';  // Перевірка, чи є значення та перетворення в рядок
        const compare = valA.localeCompare(valB);
        return this.sortDirection === 'asc' ? compare : -compare;
      });
    }

    return result;
  }

  sortBy(column: keyof User) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }  
}
