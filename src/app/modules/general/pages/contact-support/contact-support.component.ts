import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit {
  public supportEmail: string = 'support@pravo.com';
  public supportContact: string = '04 - 3034040';

  constructor(
    public router: Router,
    public _location: Location
  ) { }

  ngOnInit(): void {
  }

}
