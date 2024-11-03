import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, catchError, forkJoin, takeUntil } from 'rxjs';
import { Reward } from 'src/app/core/models/reward.model';
import { RewardService } from 'src/app/core/services/http/reward.service';
import { CartService } from 'src/app/core/services/services/cart.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { RewardDetailsComponent } from '../reward-details/reward-details.component';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { UserService } from 'src/app/core/services/services/user.service';
import { RewardTransactionsService } from 'src/app/core/services/http/reward-transactions.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-reward-catalog',
  templateUrl: './reward-catalog.component.html',
  styleUrls: ['./reward-catalog.component.scss'],
})
export class RewardCatalogComponent implements OnInit {
  @ViewChild('cart')
  private cart: CartComponent;

  public rewards: Reward[] = [];
  public userId: string = this.userService.getUserId();
  public userPoints: number = 0;
  public totalCartItems: number = 0;
  public isCart: boolean = false;
  public page: number = 0;
  public size: number = 10;
  public totalItems: number = 0;
  public pageEvent: PageEvent;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public noImageSrc = '../../../../../assets/img/no-picture.jpg';
  public now = new Date().getTime();

  constructor(
    private rewardService: RewardService,
    private toastService: ToastService,
    private authService: AuthenticationService,
    private userService: UserService,
    public cartService: CartService,
    private rewardTransactionService: RewardTransactionsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRewards();
    this.cartService.totalCartItem$.subscribe((totalCartItems) => {
      this.totalCartItems = totalCartItems;
    });
    this.getUserPoints();
  }

  private getRewards() {
    this.rewardService
      .getActiveRewards(this.page, this.size)
      .subscribe((response) => {
        this.rewards = response.data;
        this.totalItems = response.totalItems;
      });
  }

  public getUserPoints(){
    this.authService.getUser(this.userId).subscribe({
      next: (response)=>{
        this.userPoints = response.points;
      },
      error: (error)=>{
        this.toastService.showError(error.message);
      }
    });
  }

  public handlePageEvent(pageEvent: PageEvent) {
    this.pageEvent = pageEvent;
    this.totalItems = pageEvent.length;
    this.page = pageEvent.pageIndex;
    this.size = pageEvent.pageSize;
  }

  public checkIsExpired(limitedTime: string) {
    const limitedTimeInstance = new Date(limitedTime.slice(0,-1)).getTime();

    if(limitedTimeInstance <= this.now){
      //if today is greater (expired)
      return true;
    }else{
      return false;
    }
  }

  public rewardDetails(reward: Reward) {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '50vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: reward
    };

    const dialogRef = this.dialog.open(RewardDetailsComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe((response)=>{
      if(response){
        if(response.type == 'redeem'){
          this.redeemReward(response.reward);
        }else if(response.type == 'addCart'){
          this.cartService.addToCart(reward);
        }
      }
    });
  }

  public redeemReward(reward: Reward) {
    if (this.userPoints < reward.points) {
      this.toastService.showError(
        'You do not have enough points to redeeem this reward!'
      );
    } else {
      let newPoints = this.userPoints - reward.points;
      reward.quantity -= 1;
      let rewardArray = [
        {
          rewardId: reward.id,
          rewardName: reward.name,
          rewardCategory: reward.category.name,
          quantity: 1
        }
      ];

      forkJoin([
        this.authService.updatePoints(newPoints, this.userId).pipe(catchError((error)=> {throw error})),
        this.rewardService.updateQuantity(reward.quantity ,reward.id).pipe(catchError((error)=> {throw error})),
        this.rewardTransactionService.postTransaction(reward.points, JSON.stringify(rewardArray), this.userId).pipe(catchError((error)=> {throw error})),
      ]).subscribe({
        next: ([pointsUpdate, updateReward, rewardTransaction])=>{
          if(pointsUpdate && updateReward && rewardTransaction) this.toastService.showSuccess('Reward redeemed sucessfully!');
          this.getRewards();
          this.getUserPoints();
        },
        error: ([pointsUpdate, updateReward, rewardTransaction])=>{
          if(pointsUpdate) this.toastService.showError('Error updating points: ' + pointsUpdate.message + "," + pointsUpdate.error.message);
          if(updateReward) this.toastService.showError('Error updating reward quantity: ' + updateReward.message + "," + rewardTransaction.error.message);
          if(rewardTransaction) this.toastService.showError('Error inputting transaction: ' + rewardTransaction.message + "," + rewardTransaction.error.message);
        }
      });
    }
  }

  public openCart() {
    this.isCart = true;
  }

  public closeCart(value: boolean){
    this.isCart = value;
  }
}
