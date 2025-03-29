import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  articles = [
    {
      title: 'Як тестувати Angular-додатки',
      description: 'Основи тестування в Angular: Unit тести, e2e тести...',
      image: 'assets/test-angular.jpg',
      link: '/blog/test-angular'
    },
    {
      title: 'Оптимізація продуктивності',
      description: 'Як зробити Angular-додаток швидшим?',
      image: 'assets/performance.jpg',
      link: '/blog/performance'
    },
    {
      title: 'Робота з API в Angular',
      description: 'Використання HttpClient для роботи з REST API...',
      image: 'assets/api-angular.jpg',
      link: '/blog/api-angular'
    }
  ];
}
