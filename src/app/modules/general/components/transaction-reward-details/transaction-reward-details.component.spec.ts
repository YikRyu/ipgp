import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRewardDetailsComponent } from './transaction-reward-details.component';

describe('TransactionRewardDetailsComponent', () => {
  let component: TransactionRewardDetailsComponent;
  let fixture: ComponentFixture<TransactionRewardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionRewardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
