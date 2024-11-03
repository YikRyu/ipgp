import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CatalogDashboardComponent } from './pages/catalog-dashboard/catalog-dashboard.component';
import { AllRecognitionsComponent } from './components/all-recognitions/all-recognitions.component';
import { RewardStatisticComponent } from './components/reward-statistic/reward-statistic.component';
import { CatalogManagementComponent } from './components/catalog-management/catalog-management.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CategoryManagementFormComponent } from './components/category-management-form/category-management-form.component';
import { CatalogManagementFormComponent } from './components/catalog-management-form/catalog-management-form.component';
import { UserManagementFormComponent } from './components/user-management-form/user-management-form.component';
import { DeleteReactivateUserComponent } from './components/delete-reactivate-user/delete-reactivate-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  imports: [CommonModule, SharedModule, NgChartsModule ],
  exports: [AllRecognitionsComponent],
  declarations: [
    UserManagementComponent,
    CatalogDashboardComponent,
    AllRecognitionsComponent,
    RewardStatisticComponent,
    CatalogManagementComponent,
    CategoryManagementComponent,
    CategoryManagementFormComponent,
    CatalogManagementFormComponent,
    UserManagementFormComponent,
    DeleteReactivateUserComponent
  ],
})
export class AdminModule {}
