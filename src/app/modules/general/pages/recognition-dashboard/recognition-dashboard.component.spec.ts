import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognitionDashboardComponent } from './recognition-dashboard.component';

describe('RecognitionDashboardComponent', () => {
  let component: RecognitionDashboardComponent;
  let fixture: ComponentFixture<RecognitionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognitionDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognitionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
