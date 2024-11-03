import { Component } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { LocalStorageService } from './core/services/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pravo';

  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {}
}
