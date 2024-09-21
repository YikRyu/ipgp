import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { GeneralModule } from './modules/general/general.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    RouterModule,
    NgChartsModule,
    BrowserAnimationsModule,
    SharedModule, 
    CommonModule,
    CoreModule,
    UserModule,
    AdminModule,
    GeneralModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
