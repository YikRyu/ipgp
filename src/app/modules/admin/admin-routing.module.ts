import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CatalogDashboardComponent } from './pages/catalog-dashboard/catalog-dashboard.component';

const routes: Routes = [
  {
    path: "user-management",
    component: UserManagementComponent,
  },
  {
    path: "catalog-dashboard",
    component: CatalogDashboardComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
