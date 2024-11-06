import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Recognition } from 'src/app/core/models/recognition.mode';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { RecognitionService } from 'src/app/core/services/http/recognition.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { UserService } from 'src/app/core/services/services/user.service';
import { RecognitionDetailsComponent } from '../../components/recognition-details/recognition-details.component';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, forkJoin, switchMap, takeUntil } from 'rxjs';
import { AllRecognitionsComponent } from 'src/app/modules/admin/components/all-recognitions/all-recognitions.component';
import { CancelRecognitionComponent } from '../../components/cancel-recognition/cancel-recognition.component';
import { PointsTransactionsService } from 'src/app/core/services/http/points-transactions.service';

@Component({
  selector: 'app-recognition-dashboard',
  templateUrl: './recognition-dashboard.component.html',
  styleUrls: ['./recognition-dashboard.component.scss'],
})
export class RecognitionDashboardComponent implements OnInit {
  @ViewChild(AllRecognitionsComponent)
  private allRecognition: AllRecognitionsComponent;

  public userId: string = this.userService.getUserId();
  private userPoints: number = 0;
  public isAdmin: boolean = null;
  public myRecognitions: Recognition[] = [];
  public myTotalItems: number = 0;
  public myPage: number = 0;
  public mySize: number = 10;
  public myPageEvent: PageEvent;
  public approvalRecognitions: Recognition[] = [];
  public approvalTotalItems: number = 0;
  public approvalPage: number = 0;
  public approvalSize: number = 10;
  public approvalPageEvent: PageEvent;
  public peerRecognitions: Recognition[] = [];
  public peerTotalItems: number = 0;
  public peerPage: number = 0;
  public peerSize: number = 10;
  public peerPageEvent: PageEvent;
  public tab: number = 0;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public displayedColumns: string[] = [
    'id',
    'title',
    'points',
    'status',
    'createdDate',
    'modifiedBy',
    'modifiedDate',
    'actions',
  ];
  public peerDisplayedColumns: string[] = [
    'id',
    'title',
    'points',
    'status',
    'createdBy',
    'createdDate',
    'modifiedBy',
    'modifiedDate',
    'actions',
  ];

  constructor(
    private userService: UserService,
    private recognitionService: RecognitionService,
    private pointsTransactionService: PointsTransactionsService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.intializeData();
    this.userService.getUserType();
    this.userService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  private intializeData() {
    this.getMyRecognitions();
    this.getApprovalRecognitions();
    this.getPeerRecognitions();
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

  private getMyRecognitions() {
    this.recognitionService
      .getMyRecognitions(this.myPage, this.mySize, this.userId)
      .subscribe({
        next: (response) => {
          this.myRecognitions = response.data;
          this.myTotalItems = response.totalItems;
        },
        error: (error) => {
          this.toastService.showError(
            'Error fetching my recognitions: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }

  private getApprovalRecognitions() {
    this.recognitionService
      .getApprovalRecognitions(
        this.approvalPage,
        this.approvalSize,
        this.userId
      )
      .subscribe({
        next: (response) => {
          this.approvalRecognitions = response.data;
          this.approvalTotalItems = response.totalItems;
        },
        error: (error) => {
          this.toastService.showError(
            'Error fetching approval recognitions: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }

  private getPeerRecognitions() {
    this.recognitionService
      .getPeerRecognitions(this.peerPage, this.peerSize, this.userId)
      .subscribe({
        next: (response) => {
          this.peerRecognitions = response.data;
          this.peerTotalItems = response.totalItems;
        },
        error: (error) => {
          this.toastService.showError(
            'Error fetching peer recognitions: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }

  public handlePageEvent(pageEvent: PageEvent) {
    if (this.tab == 1) {
      this.myPageEvent = pageEvent;
      this.myTotalItems = pageEvent.length;
      this.myPage = pageEvent.pageIndex;
      this.mySize = pageEvent.pageSize;
      this.getMyRecognitions();
    } else if (this.tab == 2) {
      this.approvalPageEvent = pageEvent;
      this.approvalTotalItems = pageEvent.length;
      this.approvalPage = pageEvent.pageIndex;
      this.approvalSize = pageEvent.pageSize;
      this.getApprovalRecognitions();
    } else if (this.tab == 3) {
      this.peerPageEvent = pageEvent;
      this.peerTotalItems = pageEvent.length;
      this.peerPage = pageEvent.pageIndex;
      this.peerSize = pageEvent.pageSize;
      this.getPeerRecognitions();
    } else {
      this.allRecognition.handlePageEvent(pageEvent);
    }
  }

  public newRecognition() {
    this.router.navigate(['/new-recognition']);
  }

  public getStatusColor(status: string) {
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

  public openDetails(recognition: Recognition, isUpdate: boolean) {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '60vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: recognition,
        isUpdate: isUpdate,
      },
    };

    const dialogRef = this.dialog.open(
      RecognitionDetailsComponent,
      dialogConfig
    );

    if (isUpdate) {
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((response) => {
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
              }
              else
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
            this.toastService.showSuccess('Recognition updated!');
            this.getMyRecognitions();
            this.getApprovalRecognitions();
          },
          error: (error) => {
            this.toastService.showError(
              'Error updating recognition: ' +
                error.message +
                ', ' +
                error.error.message
            );
          },
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
          this.getMyRecognitions();
          this.getApprovalRecognitions();
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
