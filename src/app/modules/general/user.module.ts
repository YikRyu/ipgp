import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactSupportComponent } from './pages/contact-support/contact-support.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PointsRewardsComponent } from './pages/points-rewards/points-rewards.component';
import { NewRecognitionComponent } from './pages/new-recognition/new-recognition.component';
import { MyRecognitionsComponent } from './components/my-recognitions/my-recognitions.component';
import { RewardDetailsComponent } from './components/reward-details/reward-details.component';
import { RewardCatalogComponent } from './components/reward-catalog/reward-catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { RedeemConfirmationComponent } from './components/redeem-confirmation/redeem-confirmation.component';
import { ClearCartConfirmationComponent } from './components/clear-cart-confirmation/clear-cart-confirmation.component';
import { RecognitionDashboardComponent } from './pages/recognition-dashboard/recognition-dashboard.component';
import { AdminModule } from '../admin/admin.module';
import { RecognitionDetailsComponent } from './components/recognition-details/recognition-details.component';
import { CancelRecognitionComponent } from './components/cancel-recognition/cancel-recognition.component';
import { TransactionRewardDetailsComponent } from './components/transaction-reward-details/transaction-reward-details.component';

@NgModule({
  imports: [CommonModule, SharedModule, AdminModule ],
  exports: [RecognitionDetailsComponent, CancelRecognitionComponent],
  declarations: [
    ContactSupportComponent,
    RecognitionDashboardComponent,
    UserProfileComponent,
    UpdateProfileComponent,
    ChangePasswordComponent,
    PointsRewardsComponent,
    NewRecognitionComponent,
    PointsRewardsComponent,
    MyRecognitionsComponent,
    RewardDetailsComponent,
    RewardCatalogComponent,
    CartComponent,
    RedeemConfirmationComponent,
    ClearCartConfirmationComponent,
    RecognitionDetailsComponent,
    CancelRecognitionComponent,
    TransactionRewardDetailsComponent
  ],
})
export class UserModule {}
