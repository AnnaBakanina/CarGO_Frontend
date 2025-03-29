import { Component } from '@angular/core';
// import { UserService } from '../services/user.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  imports: [],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  user: any = { name: '', email: '' };

  // constructor(private userService: UserService, private router: Router) {}

  // ngOnInit(): void {
  //   this.userService.getUserProfile().subscribe(data => {
  //     this.user = data;
  //   });
  // }

  // saveChanges(): void {
  //   this.userService.updateUserProfile(this.user).subscribe(() => {
  //     this.router.navigate(['/profile']);
  //   });
  // }
}
