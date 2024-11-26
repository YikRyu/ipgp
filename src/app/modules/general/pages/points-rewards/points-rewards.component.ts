import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { catchError, concatMap } from 'rxjs';
import { PointsTransaction } from 'src/app/core/models/points-transaction.model';
import { Recognition } from 'src/app/core/models/recognition.mode';
import { RewardsForTransaction, RewardTransaction, RewardTransactionWithRewardsList } from 'src/app/core/models/reward-transaction.model';
import { Reward } from 'src/app/core/models/reward.model';
import { PointsTransactionsService } from 'src/app/core/services/http/points-transactions.service';
import { RecognitionService } from 'src/app/core/services/http/recognition.service';
import { RewardTransactionsService } from 'src/app/core/services/http/reward-transactions.service';
import { RewardService } from 'src/app/core/services/http/reward.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { UserService } from 'src/app/core/services/services/user.service';
import { RecognitionDetailsComponent } from '../../components/recognition-details/recognition-details.component';
import { TransactionRewardDetailsComponent } from '../../components/transaction-reward-details/transaction-reward-details.component';

@Component({
  selector: 'app-points-rewards',
  templateUrl: './points-rewards.component.html',
  styleUrls: ['./points-rewards.component.scss']
})
export class PointsRewardsComponent implements OnInit {
  public userId: string = this.userService.getUserId();
  public recognitionTransactions: PointsTransaction[] = [];
  public rewardsTransactions: RewardTransactionWithRewardsList[] = [];
  public rewards: Reward[] = [];
  public tab: number = 0;
  public recognitionPageEvent: PageEvent;
  public recognitionTotalItems: number = 0;
  public recognitionPage: number = 0;
  public recognitionSize: number = 10;
  public rewardsPageEvent: PageEvent;
  public rewardsTotalItems: number = 0;
  public rewardsPage: number = 0;
  public rewardsSize: number = 10;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public recognitionsDisplayedColumns = [
    'recognitionId', 'title', 'points', 'type', 'createdDate' 
  ];

  public rewardsDisplayedColumns = [
    'rewards', 'quantity', 'points', 'createdDate'
  ];

  constructor(
    private userService: UserService,
    private pointsTransactionService: PointsTransactionsService,
    private rewardsTransactionService: RewardTransactionsService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRewardsTransactions();
    this.getRecognitionsTransactions();
  }

  private getRecognitionsTransactions(){
    this.pointsTransactionService.getTransactions(this.userId, this.recognitionPage, this.recognitionSize)
    .subscribe({
      next: (response)=>{
        this.recognitionTransactions = response.data;
        this.recognitionTotalItems = response.totalItems;
      },
      error: (error)=>{
        this.toastService.showError('Unable to fetch recognition transactions: ' + error.message + ', ' + error.error.message);
      }
    });
  }

  private getRewardsTransactions(){
    this.rewardsTransactions = [];
    this.rewardsTransactionService.getTransactions(this.userId, this.rewardsPage, this.rewardsSize)
    .subscribe({
      next: (rewardsTransactions)=>{
        this.rewardsTotalItems = rewardsTransactions.totalItems;
        rewardsTransactions.data.map((rewardTransaction)=>{
          let rewards: RewardsForTransaction[] = JSON.parse(rewardTransaction.rewards);
          this.rewardsTransactions.push({
            id: rewardTransaction.id,
            points: rewardTransaction.points,
            rewards: rewards,
            userId: rewardTransaction.userId,
            createdDate: rewardTransaction.createdDate
          });
        });
      },
      error: (error)=>{
        this.toastService.showError('Error fetching rewards transactions: ' + error.message + ', ' + error.error.message);
      }
    });
  }

  public changeTab(tab: MatTabChangeEvent) {
    this.tab = tab.index;
  }

  public handlePageEvent(pageEvent: PageEvent) {
    if (this.tab == 0) {
      this.recognitionPageEvent = pageEvent;
      this.recognitionTotalItems = pageEvent.length;
      this.recognitionPage = pageEvent.pageIndex;
      this.recognitionSize = pageEvent.pageSize;
      this.getRecognitionsTransactions();
    } else {
      this.rewardsPageEvent = pageEvent;
      this.rewardsTotalItems = pageEvent.length;
      this.rewardsPage = pageEvent.pageIndex;
      this.rewardsSize = pageEvent.pageSize;
      this.getRewardsTransactions();
    }
  }

  public recognitionDetails(recognitionId: number){
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '60vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: recognitionId,
        isUpdate: false
      }
    };

    const dialogRef = this.dialog.open(RecognitionDetailsComponent, dialogConfig);
  }

  public rewardDetails(rewardsId: number){
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: rewardsId
    };

    const dialogRef = this.dialog.open(TransactionRewardDetailsComponent, dialogConfig);
  }

}
