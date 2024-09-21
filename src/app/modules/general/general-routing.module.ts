import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactSupportComponent } from './pages/contact-support/contact-support.component';
import { RecognitionDashboardComponent } from './components/recognition-dashboard/recognition-dashboard.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';

const routes: Routes = [
  {
    path: "contact-support",
    component: ContactSupportComponent,
  },
  {
    path: "recognition-dashboard",
    component: RecognitionDashboardComponent,
  },
  {
    path: "new-recognition",
    component: ContactSupportComponent,
  },
  {
    path: "dashboard-home",
    component: DashboardHomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}