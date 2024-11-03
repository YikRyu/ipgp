import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsRewardsComponent } from './points-rewards.component';

describe('PointsRewardsComponent', () => {
  let component: PointsRewardsComponent;
  let fixture: ComponentFixture<PointsRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
