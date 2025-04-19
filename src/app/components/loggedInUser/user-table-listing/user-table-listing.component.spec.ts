import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableListingComponent } from './user-table-listing.component';

describe('UserTableListingComponent', () => {
  let component: UserTableListingComponent;
  let fixture: ComponentFixture<UserTableListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTableListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
