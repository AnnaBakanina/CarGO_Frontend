import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array(pageCount).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
