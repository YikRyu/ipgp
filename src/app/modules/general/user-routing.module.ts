import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactSupportComponent } from './pages/contact-support/contact-support.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PointsRewardsComponent } from './pages/points-rewards/points-rewards.component';
import { NewRecognitionComponent } from './pages/new-recognition/new-recognition.component';
import { RewardCatalogComponent } from './components/reward-catalog/reward-catalog.component';
import { RecognitionDashboardComponent } from './pages/recognition-dashboard/recognition-dashboard.component';

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
    path: "points-rewards",
    component: PointsRewardsComponent,
  },
  {
    path: "new-recognition",
    component: NewRecognitionComponent,
  },
  {
    path: "user-profile",
    component: UserProfileComponent,
  },
  {
    path: "reward-catalog",
    component: RewardCatalogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}