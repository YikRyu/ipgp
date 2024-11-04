import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EMPTY, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Recognition } from 'src/app/core/models/recognition.mode';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { PointsTransactionsService } from 'src/app/core/services/http/points-transactions.service';
import { RecognitionService } from 'src/app/core/services/http/recognition.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { UserService } from 'src/app/core/services/services/user.service';
import { CancelRecognitionComponent } from 'src/app/modules/general/components/cancel-recognition/cancel-recognition.component';
import { RecognitionDetailsComponent } from 'src/app/modules/general/components/recognition-details/recognition-details.component';

@Component({
  selector: 'app-all-recognitions',
  templateUrl: './all-recognitions.component.html',
  styleUrls: ['./all-recognitions.component.scss']
})
export class AllRecognitionsComponent implements OnInit {
  @Input() isAdmin: boolean;
  public userId: string = this.userService.getUserId();
  private userPoints: number = 0;
  public allRecognitions: Recognition[] = [];
  public totalItems: number = 0;
  public page: number = 0;
  public size: number = 10;
  public pageEvent: PageEvent;
  public tab: number = 0;  
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public displayedColumns: string[] = ['id', 'title', 'status', 'createdBy', 'createdDate', 'modifiedBy', 'modifiedDate', 'actions'];

  constructor(
    private userService: UserService,
    private recognitionService: RecognitionService,
    private pointsTransactionService: PointsTransactionsService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllRecognitions();
    this.getUserPoints();
  }

  public changeTab(tab: MatTabChangeEvent) {
    this.tab = tab.index;
  }

  private getUserPoints(){
    this.authService.getUser(this.userId).subscribe({
      next: (response) =>{
        this.userPoints = response.points;
      },
      error: (error)=>{
        this.toastService.showError('Error fetching user points: ' + error.message + ', ' + error.error.message);
      }
    });
  }
  
  private getAllRecognitions(){
    this.recognitionService.getAllRecognitions(this.page, this.size).subscribe({
      next: (response)=>{
        this.allRecognitions = response.data;
        this.totalItems = response.totalItems;
      },
      error: (error)=>{
        this.toastService.showError('Error fetching all recognitions: ' + error.message + ", " + error.error.message);
      }
    });
  }

  public handlePageEvent(pageEvent: PageEvent){
    this.pageEvent = pageEvent;
    this.totalItems = pageEvent.length;
    this.page = pageEvent.pageIndex;
    this.size = pageEvent.pageSize;
    this.getAllRecognitions();
  }

  public getStatusColor(status: string){
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-danger';
      case 'cancel':
        return 'text-secondary';
      default:
        return 'text-dark';
    }
  }

  public openDetails(recognition: Recognition, isUpdate: boolean){
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '60vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: recognition,
        isUpdate: isUpdate
      }
    };

    const dialogRef = this.dialog.open(RecognitionDetailsComponent, dialogConfig);

    if(isUpdate){
      dialogRef.afterClosed().pipe(
       switchMap((response)=>{
        if (response) {
          if (response.status == 'approved'){
            let newUserPoints = this.userPoints + response.points;
            if(recognition.type == 'self'){
              return forkJoin([
                this.recognitionService.putRecognition(
                  response,
                  recognition.id
                ),
                this.pointsTransactionService.postTransaction(
                  recognition.id,
                  recognition.createdBy.id
                ),
                this.authService.updatePoints(newUserPoints, recognition.createdBy.id)
              ]);
            }else{
              return forkJoin([
                this.recognitionService.putRecognition(
                  response,
                  recognition.id
                ),
                this.pointsTransactionService.postTransaction(
                  recognition.id,
                  recognition.createdBy.id
                ),
                this.pointsTransactionService.postTransaction(
                  recognition.id,
                  recognition.peer.id
                ),
                this.authService.updatePoints(newUserPoints, recognition.peer.id)
              ]);
            }  
          } else
            return this.recognitionService.putRecognition(
              response,
              recognition.id
            );
        } else {
          return EMPTY;
        }
       }) 
      ).subscribe({
        next: (response) => {
          this.toastService.showSuccess('Recognition updated!');
          this.getAllRecognitions();
        },
        error: (error) => {
          this.toastService.showError('Error updating recognition: ' + error.message + ', ' + error.error.message);
        }
      });
    }
  }

  public cancelRecognition(recognition: Recognition) {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: recognition,
      },
    };

    const dialogRef = this.dialog.open(
      CancelRecognitionComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((response) => {
          if (response) {
            return this.recognitionService.putRecognition(
              response,
              recognition.id
            );
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess('Recognition cancelled!');
          this.getAllRecognitions();
        },
        error: (error) => {
          this.toastService.showError(
            'Error cancelling recognition: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }
}
