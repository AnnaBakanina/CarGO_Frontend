import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTableListingComponent } from './vehicle-table-listing.component';

describe('VehicleTableListingComponent', () => {
  let component: VehicleTableListingComponent;
  let fixture: ComponentFixture<VehicleTableListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTableListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTableListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
