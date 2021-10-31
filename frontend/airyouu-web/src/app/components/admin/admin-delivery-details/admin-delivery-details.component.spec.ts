import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveryDetailsComponent } from './admin-delivery-details.component';

describe('AdminDeliveryDetailsComponent', () => {
  let component: AdminDeliveryDetailsComponent;
  let fixture: ComponentFixture<AdminDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDeliveryDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
