import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogManagementFormComponent } from './catalog-management-form.component';

describe('CatalogManagementFormComponent', () => {
  let component: CatalogManagementFormComponent;
  let fixture: ComponentFixture<CatalogManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogManagementFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
