import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
contactEmail = 'contact.us@cargo.com';

  constructor(private toastr: ToastrService) {
    emailjs.init('Mw4TGFbfUw0yqGkqk');
  }

  sendEmail(event: Event) {
    event.preventDefault();

    emailjs.sendForm(
      'service_8daunzg',
      'template_04iouuo',
      event.target as HTMLFormElement,
      'Mw4TGFbfUw0yqGkqk'
    ).then(() => {
      this.toastr.success('Лист надіслано', 'Готово!');
    }).catch((error) => {
      console.error('Помилка при надсиланні листа:', error);
      this.toastr.error('Щось пішло не так...', 'Упс!');
    });
  }
}
