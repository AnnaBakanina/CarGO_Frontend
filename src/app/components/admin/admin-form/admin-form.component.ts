import { Vehicle } from '../../../models/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Component, OnInit } from '@angular/core';
// import Chart from 'chart.js/auto';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PolarAreaController,
  ArcElement
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PolarAreaController,
  ArcElement
);

@Component({
  selector: 'app-admin-form',
  imports: [],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selledVehicles: Vehicle[] = [];
  users: User[] = [];
  allResultsQuery: any = { pageSize: 10000 };
  allSelledVehiclesQuery: any = { advertisementStatusId: 3 };

  constructor(
    private vehicleService: VehicleService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.vehicleService.getAllVehicles(this.allResultsQuery).subscribe((results: any) => {
      this.vehicles = results.data;
      setTimeout(() => this.renderRevenueChart(), 0);
    });
    this.vehicleService.getAllVehicles(this.allSelledVehiclesQuery).subscribe((results: any) => {
      this.selledVehicles = results.data;
      setTimeout(() => this.renderBrandChart(), 0);
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

  private renderBrandChart(): void{
    const brandCounts = this.selledVehicles.reduce((acc, curr) => {
    acc[curr.brand.name] = (acc[curr.brand.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(brandCounts);
    const data = Object.values(brandCounts);

    const ctx = (document.getElementById('brandChart') as HTMLCanvasElement).getContext('2d');

    new Chart(ctx!, {
      type: 'polarArea',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vehicles by Brand',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(100, 200, 100, 0.5)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            pointLabels: {
              centerPointLabels: true
            }
          }
        }
      }
    });
  }
}
