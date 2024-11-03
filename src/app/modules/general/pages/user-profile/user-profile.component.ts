import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { LocalStorageService } from 'src/app/core/services/services/local-storage.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateProfileComponent } from '../../components/update-profile/update-profile.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { EMPTY, switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private userId: string;
  public user: User;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(){
    this.userId = this.userService.getUserId();

    this.authService.getUser(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        this.localStorageService.setItem('current-user', JSON.stringify(response));
      },
      error: (error) =>{
        this.toastService.showError('Error while fetching for user details!: ' + error.message);
      }
    });
  }

  public updateProfile(){
    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: {
        data: this.user,
        userId: this.userId
      }
    }

    const dialogRef = this.dialog.open(UpdateProfileComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      switchMap(
        (response)=>{
          if(response){
            return this.authService.putUser(response.data, this.userId);
          }else{
            return EMPTY;
          }
        }
      )
    )
    .subscribe({
      next: (response) => {
        this.toastService.showSuccess('Profile has been updated!');
        this.getUser();
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      } 
    });
  }

  public changePassword(){
    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      width: '40vw',
      minHeight: '20vh',
      maxHeight: '80vh',
      data: this.user
    }
    const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      switchMap(
        (response)=>{
          if(response){
            return this.authService.updatePassword(response.oldPassword, response.newPassword, this.userId);
          }else{
            return EMPTY;
          }
        }
      )
    )
    .subscribe({
      next: (response) => {
        this.toastService.showSuccess('Password has been changed!');
      },
      error: (error) => {
        this.toastService.showError(error.error.message);
      } 
    });
  }

  public logout(){
    this.localStorageService.removeItem('current-user');
    this.router.navigate(['/login']);
  }

}
