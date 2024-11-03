import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/services/local-storage.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { UserService } from '../../services/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAdmin: boolean = null;
  public navList: any[] = [];
  private onDestroySubject = new BehaviorSubject<boolean>(false);
  private onDestroy$ = this.onDestroySubject.asObservable();

  constructor(
    public router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isAdmin$
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        this.navInit();
      });
  }

  ngOnDestroy(): void {
    this.onDestroySubject.next(true);
    this.onDestroySubject.unsubscribe();
  }

  private navInit() {
    this.navList = [];
    if (!this.isAdmin) {
      this.navList.push(
        {
          title: 'Recognition Dashboard',
          route: '/recognition-dashboard',
        },
        {
          title: 'Points & Rewards',
          route: '/points-rewards',
        },
        {
          title: 'Contact Support',
          route: '/contact-support',
        }
      );
    } else {
      this.navList.push(
        {
          title: 'Recognition Dashboard',
          route: '/recognition-dashboard',
        },
        {
          title: 'Catalog Dashboard',
          route: '/catalog-dashboard',
        },
        {
          title: 'User Management',
          route: '/user-management',
        },
        {
          title: 'Points & Rewards',
          route: '/points-rewards',
        },
        {
          title: 'Contact Support',
          route: '/contact-support',
        }
      );
    }
  }

  public navigate(route: string) {
    this.router.navigate([route]);
  }

  public logout() {
    this.localStorageService.removeItem('current-user');
    this.router.navigate(['/login']);
  }
}
