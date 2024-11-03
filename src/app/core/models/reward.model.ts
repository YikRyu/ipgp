import { Data } from "@angular/router";
import { Category } from "./category.model";
import { User } from "./user.model";

export class Reward {
  id: number;
  name: string;
  description: string;
  category: Category;
  points: number;
  quantity: number;
  limited: boolean;
  limitedTime: Date;
  image: string;
  createdBy: User;
  createdDate: Date;
  modifiedBy: User;
  modifiedDate: Date;
}

export class RewardEntryDto{
  name: string;
  description: string;
  category: number;
  points: number;
  quantity: number;
  limited: boolean;
  limitedTime: string | null;
  image: string;
  createdBy: string;
  modifiedBy: string;
}

export class ChartRewardDto {
  category: Category;
}

export class CartItems {
  reward: Reward;
  quantity: number;
};

export class BulkQuantityUpdateDto{
  rewardId: number;
  quantity: number;
}