import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardStatisticComponent } from './reward-statistic.component';

describe('RewardStatisticComponent', () => {
  let component: RewardStatisticComponent;
  let fixture: ComponentFixture<RewardStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
