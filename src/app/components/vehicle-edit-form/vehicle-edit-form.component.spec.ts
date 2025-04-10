import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditFormComponent } from './vehicle-edit-form.component';

describe('VehicleEditFormComponent', () => {
  let component: VehicleEditFormComponent;
  let fixture: ComponentFixture<VehicleEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
