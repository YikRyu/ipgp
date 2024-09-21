import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecognitionComponent } from './new-recognition.component';

describe('NewRecognitionComponent', () => {
  let component: NewRecognitionComponent;
  let fixture: ComponentFixture<NewRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRecognitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
