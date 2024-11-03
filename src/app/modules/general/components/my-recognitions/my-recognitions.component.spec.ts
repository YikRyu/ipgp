import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecognitionsComponent } from './my-recognitions.component';

describe('MyRecognitionsComponent', () => {
  let component: MyRecognitionsComponent;
  let fixture: ComponentFixture<MyRecognitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRecognitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRecognitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
