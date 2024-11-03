import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRecognitionComponent } from './cancel-recognition.component';

describe('CancelRecognitionComponent', () => {
  let component: CancelRecognitionComponent;
  let fixture: ComponentFixture<CancelRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelRecognitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
