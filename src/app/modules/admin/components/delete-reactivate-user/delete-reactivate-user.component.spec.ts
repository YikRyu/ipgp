import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReactivateUserComponent } from './delete-reactivate-user.component';

describe('DeleteReactivateUserComponent', () => {
  let component: DeleteReactivateUserComponent;
  let fixture: ComponentFixture<DeleteReactivateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteReactivateUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReactivateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
