import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AuthenticationService } from '../http/authentication.service';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  public isAdminSubject = new BehaviorSubject<boolean>(null);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthenticationService,
    private toastService: ToastService
  ){}

  public getUserId(): string{
    let currentUser = JSON.parse(this.localStorageService.getItem('current-user'));
    return currentUser.id;
  }

  public getUserType(){
    this.authService.getUser(this.getUserId()).subscribe({
      next: (user)=>{
        if(user.type == 'admin') this.isAdminSubject.next(true);
        else this.isAdminSubject.next(false);
      },
      error: (error)=>{
        this.toastService.showError('Error checking user type:' + error.message + ', ' + error.error.message);
      }
    });
  }
  
}