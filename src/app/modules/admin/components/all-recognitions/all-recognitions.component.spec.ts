import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecognitionsComponent } from './all-recognitions.component';

describe('AllRecognitionsComponent', () => {
  let component: AllRecognitionsComponent;
  let fixture: ComponentFixture<AllRecognitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRecognitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecognitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
