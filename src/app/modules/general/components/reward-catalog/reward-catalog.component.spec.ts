import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCatalogComponent } from './reward-catalog.component';

describe('RewardCatalogComponent', () => {
  let component: RewardCatalogComponent;
  let fixture: ComponentFixture<RewardCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
