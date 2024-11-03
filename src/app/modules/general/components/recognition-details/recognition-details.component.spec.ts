import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognitionDetailsComponent } from './recognition-details.component';

describe('RecognitionDetailsComponent', () => {
  let component: RecognitionDetailsComponent;
  let fixture: ComponentFixture<RecognitionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognitionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognitionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
