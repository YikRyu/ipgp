import { Injectable } from "@angular/core";
import { CartItems, Reward } from "../../models/reward.model";
import { ToastService } from "./toast.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root',})
export class CartService{
  public cartItems: CartItems[] = [];
  public totalCartItemsSubject = new BehaviorSubject<number>(0);
  public totalCartItem$: Observable<number> = this.totalCartItemsSubject.asObservable();

  constructor(
    private toastService: ToastService
  ){}

  public addToCart(reward: Reward){
    let totalCartItems = this.totalCartItemsSubject.value;
    let isExist = this.cartItems.find((cartItem)=> cartItem.reward.id == reward.id);
    if(isExist){
      //if the item is found in the cart and amount is already zero deducting those in cart, trhwo error message and prevent addition
      if((isExist.reward.quantity - (isExist.quantity)) == 0){
        this.toastService.showError("Exceeded item limite, unable to add more to the cart!");
      }else{
        for(let cartItem of this.cartItems){
          if(cartItem.reward.id == isExist.reward.id){
            cartItem.quantity += 1;
            break;
          }
        }
        this.totalCartItemsSubject.next(totalCartItems +1);
        this.toastService.showInfo("Reward added to cart!");
      }
    }else{
      //if not found existing in the cart, add new entity and quantity
      this.cartItems.push({reward: reward, quantity: 1});
      this.totalCartItemsSubject.next(totalCartItems +1);
      this.toastService.showInfo("Reward added to cart!");
    }
  }

  public removeItemFromCart(rewardId: number){
    let totalCartItems = this.totalCartItemsSubject.value;
    let isExist = this.cartItems.find((cartItem)=> cartItem.reward.id == rewardId);

    this.cartItems = this.cartItems.filter((cartItem) => cartItem.reward.id != rewardId);
    this.totalCartItemsSubject.next(totalCartItems -= isExist.quantity);

    this.toastService.showInfo("Reward cleared from cart!");
  }

  public removeOneFromCart(rewardId: number){
    let totalCartItems = this.totalCartItemsSubject.value;
    let isExist = this.cartItems.find((cartItem)=> cartItem.reward.id == rewardId);
    
    if(isExist){
      //if the item is found in the cart and amount is already zero deducting those in cart, trhwo error message and prevent addition
      if((isExist.reward.quantity - 1) == 0){
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.reward.id != rewardId);
      }else{
        for(let cartItem of this.cartItems){
          if(cartItem.reward.id == isExist.reward.id){
            cartItem.quantity -= 1;
          }
          break;
        }
        this.toastService.showInfo("Reward removed from cart!");
      }
    }
    this.totalCartItemsSubject.next(totalCartItems -= 1);
  }

  public clearCart(){
    this.cartItems = [];
    this.totalCartItemsSubject.next(0);
  }

}