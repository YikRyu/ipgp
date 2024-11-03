import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemConfirmationComponent } from './redeem-confirmation.component';

describe('RedeemConfirmationComponent', () => {
  let component: RedeemConfirmationComponent;
  let fixture: ComponentFixture<RedeemConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
