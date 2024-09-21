import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactSupportComponent } from './pages/contact-support/contact-support.component';
import { RecognitionDashboardComponent } from './components/recognition-dashboard/recognition-dashboard.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [],
  declarations: [
    ContactSupportComponent,
    RecognitionDashboardComponent,
    DashboardHomeComponent
  ],
})
export class GeneralModule {}
