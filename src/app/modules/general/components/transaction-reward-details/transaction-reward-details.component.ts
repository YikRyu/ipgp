import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reward } from 'src/app/core/models/reward.model';
import { RewardService } from 'src/app/core/services/http/reward.service';
import { ToastService } from 'src/app/core/services/services/toast.service';

@Component({
  selector: 'app-transaction-reward-details',
  templateUrl: './transaction-reward-details.component.html',
  styleUrls: ['./transaction-reward-details.component.scss']
})
export class TransactionRewardDetailsComponent implements OnInit {
  private rewardId: number = this.data;
  public reward: Reward;
  public noImageSrc: string = "../../../../../assets/img/no-picture.jpg";

  constructor(
    private rewardService: RewardService,
    private toastService: ToastService,
    private dialogRef: MatDialogRef<TransactionRewardDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit(): void {
    this.getRewardDetails();
  }

  public closeDialog(){
    this.dialogRef.close();
  }

  private getRewardDetails(){
    this.rewardService.getRewardsDetails([this.rewardId]).subscribe({
      next: (response)=>{
        this.reward = response[0];
        console.log(response);
      },
      error: (error)=>{
        this.toastService.showError('Error fetching reward details: ' + error.message + ', ' + error.error.message);
      }
    });
  }

}
