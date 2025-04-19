import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInfoPopupComponent } from './vehicle-info-popup.component';

describe('VehicleInfoPopupComponent', () => {
  let component: VehicleInfoPopupComponent;
  let fixture: ComponentFixture<VehicleInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleInfoPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
