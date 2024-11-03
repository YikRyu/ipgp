import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Reward } from 'src/app/core/models/reward.model';

@Component({
  selector: 'app-reward-details',
  templateUrl: './reward-details.component.html',
  styleUrls: ['./reward-details.component.scss']
})
export class RewardDetailsComponent implements OnInit {
  public reward :Reward = this.data;
  private now: number = new Date().getTime();
  public noImageSrc = '../../../../../assets/img/no-picture.jpg';

  constructor(
    private dialogRef: MatDialogRef<RewardDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit(): void {
  }

  public closeDialog(){
    this.dialogRef.close();
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

  public submit(type: string){
    this.dialogRef.close({
      type: type,
      reward: this.reward
    });
  }

}
