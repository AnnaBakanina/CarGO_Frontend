import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPopupComponent } from './edit-user-popup.component';

describe('EditUserPopupComponent', () => {
  let component: EditUserPopupComponent;
  let fixture: ComponentFixture<EditUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
