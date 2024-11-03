import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, takeUntil } from 'rxjs';
import {
  BulkQuantityUpdateDto,
  CartItems,
  Reward,
} from 'src/app/core/models/reward.model';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { RewardTransactionsService } from 'src/app/core/services/http/reward-transactions.service';
import { RewardService } from 'src/app/core/services/http/reward.service';
import { CartService } from 'src/app/core/services/services/cart.service';
import { ToastService } from 'src/app/core/services/services/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  @Input() isCart: boolean;
  @Input() userPoints: number;
  @Input() userId: string;
  @Output() isCartEmitter = new EventEmitter<boolean>();
  @Output() redeemedEmitter = new EventEmitter<void>();

  public cart: CartItems[] = this.cartService.cartItems;
  public totalCartItems: number = 0;
  public totalPoints: number = 0;
  private pointsArray: number[] = [];
  public noImageSrc = '../../../../../assets/img/no-picture.jpg';

  constructor(
    public cartService: CartService,
    private rewardService: RewardService,
    private authService: AuthenticationService,
    private rewardTransactionService: RewardTransactionsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.totalCartItem$.subscribe((totalCartItems) => {
      this.totalCartItems = totalCartItems;
    });
  }

  public onBack() {
    this.isCart = false;
    this.isCartEmitter.emit(false);
  }

  public countPerTotalPoints(cartItem: CartItems): number {
    let points = cartItem.quantity * cartItem.reward.points;
    this.pointsArray.push(points);
    return points;
  }

  public countTotalPoints(): number {
    let totalPoints: number = 0;
    for (let cartItem of this.cart) {
      let points: number = cartItem.quantity * cartItem.reward.points;
      totalPoints += points;
    }
    this.totalPoints = totalPoints;

    return totalPoints;
  }

  public clearCart(fromCart: boolean) {
    if (!fromCart) this.toastService.showSuccess('Cart cleared!');
    this.cart = [];
    this.cartService.clearCart();
  }

  public onRedeem() {
    if (this.userPoints < this.totalPoints) {
      this.toastService.showError(
        'You do not have enough points to redeem all items in the cart!'
      );
    } else {
      let newPoints = this.userPoints - this.totalPoints;
      let rewardArray: any[] = [];
      let bulkQuantityUpdateArray: BulkQuantityUpdateDto[] = [];

      for (let cartItem of this.cart) {
        let newQuantity = cartItem.reward.quantity - cartItem.quantity;

        rewardArray.push({
          rewardId: cartItem.reward.id,
          rewardName: cartItem.reward.name,
          rewardCategory: cartItem.reward.category.name,
          quantity: cartItem.quantity,
        });

        bulkQuantityUpdateArray.push({
          rewardId: cartItem.reward.id,
          quantity: newQuantity,
        });
      }

      forkJoin([
        this.rewardService.bulkUpdateQuantity(bulkQuantityUpdateArray).pipe(
          catchError((error) => {
            throw error;
          })
        ),
        this.authService.updatePoints(newPoints, this.userId).pipe(
          catchError((error) => {
            throw error;
          })
        ),
        this.rewardTransactionService
          .postTransaction(
            this.totalPoints,
            JSON.stringify(rewardArray),
            this.userId
          )
          .pipe(
            catchError((error) => {
              throw error;
            })
          ),
      ]).subscribe({
        next: ([ updateReward, pointsUpdate, rewardTransaction]) => {
          if (pointsUpdate && updateReward && rewardTransaction)
            this.toastService.showSuccess('Reward redeemed sucessfully!');
          this.redeemedEmitter.emit();
          this.clearCart(true);
        },
        error: ([updateReward, pointsUpdate, rewardTransaction]) => {
          if (pointsUpdate)
            this.toastService.showError(
              'Error updating points: ' +
                pointsUpdate.message +
                ',' +
                pointsUpdate.error.message
            );
          if (updateReward)
            this.toastService.showError(
              'Error updating reward quantity: ' +
                updateReward.message +
                ',' +
                rewardTransaction.error.message
            );
          if (rewardTransaction)
            this.toastService.showError(
              'Error inputting transaction: ' +
                rewardTransaction.message +
                ',' +
                rewardTransaction.error.message
            );
        },
      });
    }
  }
}
