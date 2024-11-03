import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Reward } from 'src/app/core/models/reward.model';
import { RewardService } from 'src/app/core/services/http/reward.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { CatalogManagementFormComponent } from '../catalog-management-form/catalog-management-form.component';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs/internal/observable/empty';

@Component({
  selector: 'app-catalog-management',
  templateUrl: './catalog-management.component.html',
  styleUrls: ['./catalog-management.component.scss']
})
export class CatalogManagementComponent implements OnInit {
  public rewards: Reward[] = [];
  public page: number = 0;
  public size: number = 10;
  public totalItems: number = 0;
  public displayedColumns: string[] = ['name', 'category' , 'points', 'quantity', 'createdBy', 'createdDate', 'modifiedBy', 'modifiedDate', 'actions'];
  public pageEvent: PageEvent;
  public pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private rewardService: RewardService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRewards();
  }

  public getRewards(){
    this.rewardService.getActiveRewards(this.page, this.size).subscribe({
      next: (response) => {
        this.rewards = response.data;
        this.totalItems = response.totalItems;
      },
      error: (error) => {
        this.toastService.showError(error.message);
      }
    });
  }

  public handlePageEvent(pageEvent: PageEvent){
    this.pageEvent = pageEvent;
    this.totalItems = pageEvent.length;
    this.page = pageEvent.pageIndex;
    this.size = pageEvent.pageSize;
    this.getRewards();
  }

  public showForm(isAdd: boolean, isEdit: boolean, isDelete: boolean, reward?: Reward){
    let minHeight;
    let maxHeight;
    if(isDelete) {minHeight = '20vh'; maxHeight = '40vh';}
    else {minHeight = '55vh', maxHeight = '80vh';}
    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      minWidth: '40vw',
      maxWidth: '60vw',
      minHeight: minHeight,
      maxHeight: maxHeight,
      data: {
        data: reward,
        isAdd: isAdd,
        isEdit: isEdit,
        isDelete: isDelete
      }
    };

    const dialogRef = this.dialog.open(CatalogManagementFormComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      switchMap(
        (response)=>{
          if(response){
            if (isAdd) return this.rewardService.postReward(response);
            else if (isEdit) return this.rewardService.putReward(response, reward.id);
            else return this.rewardService.deleteReward(reward.id);
          }else{
            return EMPTY;
          }
        }
      )
    )
    .subscribe({
      next: (response) => {
        //for delete
        if(typeof response === 'boolean') this.toastService.showSuccess('Reward has been deleted!');
        else{
          if(isAdd) this.toastService.showSuccess('New reward has been added!');
          else this.toastService.showSuccess('Reward has been updated!');
        }
        this.getRewards();
      },
      error: (error) => {
        this.toastService.showError(error.message);
      } 
    });
  }
}
