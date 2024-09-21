import { Component } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pravo';
  public isNormalLayout: boolean;
  private routeString: string = '';

  constructor(private route: Router) {
    this.route.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.routeString = this.route.url;
      }
    });

    if(this.routeString == '' || this.routeString == '/login'){
      this.isNormalLayout = false;
    }else{
      this.isNormalLayout = true;
    }
  }

  ngOnInit(): void {}
}
