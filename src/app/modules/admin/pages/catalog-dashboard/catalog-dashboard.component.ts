import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-catalog-dashboard',
  templateUrl: './catalog-dashboard.component.html',
  styleUrls: ['./catalog-dashboard.component.scss']
})
export class CatalogDashboardComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserType();
  }

}
