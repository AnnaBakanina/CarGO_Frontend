import { Vehicle } from '../../../models/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-admin-form',
  imports: [],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent implements OnInit {
  vehicles: Vehicle[] = [];
  users: User[] = [];

  constructor(
    private vehicleService: VehicleService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.vehicleService.getAllVehicles().subscribe((results: any) => {
      this.vehicles = results.data;
      setTimeout(() => this.renderRevenueChart(), 0);
    });
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  private renderRevenueChart(): void {
    const grouped = this.groupByDate(this.vehicles.map(v => v.lastUpdated));

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Оголошення за день',
          data: data,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Дата'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Кількість'
            }
          }
        }
      }
    });
  }

  private groupByDate(dates: string[]): { [date: string]: number } {
    const counts: { [date: string]: number } = {};
    for (const dateString of dates) {
      const date = new Date(dateString).toISOString().split('T')[0];
      counts[date] = (counts[date] || 0) + 1;
    }
    return counts;
  }
}
