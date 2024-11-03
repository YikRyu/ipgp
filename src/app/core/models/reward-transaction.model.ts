import { User } from "./user.model";

export class RewardTransaction{
  id: number;
  points: number;
  rewards: string;
  userId: User;
  createdDate: Date;
}

export class RewardsForTransaction{
  rewardId: number;
  rewardName: string;
  rewardCategory: string;
  quantity: number;
}

export class RewardTransactionWithRewardsList{
  id: number;
  points: number;
  rewards: RewardsForTransaction[];
  userId: User;
  createdDate: Date;
}