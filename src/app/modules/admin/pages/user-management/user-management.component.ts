import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { catchError, EMPTY, forkJoin, switchMap } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { UserService } from 'src/app/core/services/services/user.service';
import { UserManagementFormComponent } from '../../components/user-management-form/user-management-form.component';
import { ChangePasswordComponent } from 'src/app/modules/general/components/change-password/change-password.component';
import { DeleteReactivateUserComponent } from '../../components/delete-reactivate-user/delete-reactivate-user.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private userId: string = this.userService.getUserId();
  public users: User[] = [];
  public admins: User[] = [];
  public tab: number = 0;
  public userPage: number = 0;
  public userSize: number = 10;
  public userTotalItems: number = 0;
  public userPageEvent: PageEvent;
  public adminPage: number = 0;
  public adminSize: number = 10;
  public adminTotalItems: number = 0;
  public adminPageEvent: PageEvent;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'position',
    'department',
    'actions',
  ];

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData() {
    forkJoin([
      this.authService.getUsers(this.userPage, this.userSize, this.userId).pipe(
        catchError((error) => {
          throw error;
        })
      ),
      this.authService
        .getAdmins(this.adminPage, this.adminSize, this.userId)
        .pipe(
          catchError((error) => {
            throw error;
          })
        ),
    ]).subscribe({
      next: ([users, admins]) => {
        this.users = users.data;
        this.userTotalItems = users.totalItems;

        this.admins = admins.data;
        this.adminTotalItems = admins.totalItems;
      },
      error: ([userError, adminError]) => {
        if (userError)
          this.toastService.showError(
            'Error fetching users: ' +
              userError.message +
              ', ' +
              userError.error.message
          );
        if (adminError)
          this.toastService.showError(
            'Error fetching admins: ' +
              adminError.message +
              ', ' +
              adminError.error.message
          );
      },
    });
  }

  private getUsers() {
    this.authService
      .getUsers(this.userPage, this.userSize, this.userId)
      .subscribe({
        next: (users) => {
          this.users = users.data;
          this.userTotalItems = users.totalItems;
        },
        error: (error) => {
          this.toastService.showError(
            'Error fetching users: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }

  private getAdmins() {
    this.authService
      .getAdmins(this.adminPage, this.adminSize, this.userId)
      .subscribe({
        next: (admins) => {
          this.admins = admins.data;
          this.adminTotalItems = admins.totalItems;
        },
        error: (error) => {
          this.toastService.showError(
            'Error fetching admins: ' +
              error.message +
              ', ' +
              error.error.message
          );
        },
      });
  }

  public changeTab(tab: MatTabChangeEvent) {
    this.tab = tab.index;
  }

  public handlePageEvent(pageEvent: PageEvent) {
    if (this.tab == 0) {
      this.userPageEvent = pageEvent;
      this.userTotalItems = pageEvent.length;
      this.userPage = pageEvent.pageIndex;
      this.userSize = pageEvent.pageSize;
      this.getUsers();
    } else {
      this.adminPageEvent = pageEvent;
      this.adminTotalItems = pageEvent.length;
      this.adminPage = pageEvent.pageIndex;
      this.adminSize = pageEvent.pageSize;
      this.getAdmins();
    }
  }

  public showForm(isAdd: boolean, isEdit: boolean, user?: User) {
    let data;
    if (isAdd) data = { isAdd: isAdd, isEdit: isEdit };
    else data = { user: user, isAdd: isAdd, isEdit: isEdit };
    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: data,
    };

    const dialogRef = this.dialog.open(
      UserManagementFormComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((response) => {
          if (response) {
            if (isAdd) return this.authService.postUser(response);
            else return this.authService.putUser(response, user.id);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (isAdd) {
            this.toastService.showSuccess(
              'New User ' + response.name + ' has been added!'
            );
            this.getAdmins();
            this.getUsers();
          }
          if (isEdit) {
            if(this.tab == 0) {
              this.toastService.showSuccess(
                'User ' + response.name + ' has been edited!'
              );
            }else{
              this.toastService.showSuccess(
                'Admin ' + response.name + ' has been edited!'
              );
            }
            this.getUsers();
            this.getAdmins();
          }
            
          if (this.tab == 0) this.getUsers();
          else this.getAdmins();
        },
        error: (error) => {
          if (isAdd)
            this.toastService.showError(
              'Unable to add new user: ' +
                error.message +
                ', ' +
                error.error.message
            );
          if (isEdit)
            this.toastService.showError(
              'Unable to edit user: ' +
                error.message +
                ', ' +
                error.error.message
            );
        },
      });
  }

  public deleteReactivateUser(
    isDelete: boolean,
    isReactivate: boolean,
    user: User
  ) {
    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '40vh',
      data: {
        isDelete: isDelete,
        isReactivate: isReactivate,
        user: user,
      },
    };

    const dialogRef = this.dialog.open(
      DeleteReactivateUserComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((response) => {
          if (response) {
            if (isDelete) return this.authService.deleteUser(user.id);
            else return this.authService.reactivateUser(user.id);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (isDelete) {
            this.toastService.showSuccess(
              'User ' + user.name + ' has been deactivated!'
            );
            if(this.tab == 0) this.getUsers();
            else this.getAdmins();
          }else {
            this.toastService.showSuccess(
              'User ' + user.name + ' has been reactivated!'
            );
            if(this.tab == 0) {
              this.getUsers();
            }else{
              this.getAdmins();
            }
          }
            
          if (this.tab == 0) this.getUsers();
          else this.getAdmins();
        },
        error: (error) => {
          if (isDelete)
            this.toastService.showError(
              'Unable to deactivate user: ' +
                error.message +
                ', ' +
                error.error.message
            );
          if (isReactivate)
            this.toastService.showError(
              'Unable to reactivate user: ' +
                error.message +
                ', ' +
                error.error.message
            );
        },
      });
  }
}
