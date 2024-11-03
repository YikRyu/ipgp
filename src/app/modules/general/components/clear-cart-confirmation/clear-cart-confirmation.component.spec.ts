import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearCartConfirmationComponent } from './clear-cart-confirmation.component';

describe('ClearCartConfirmationComponent', () => {
  let component: ClearCartConfirmationComponent;
  let fixture: ComponentFixture<ClearCartConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearCartConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearCartConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
