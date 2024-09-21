import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Components
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

//Imports Module
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';

// Import refactor
import { SharedModule } from '../shared/shared.module';
import { GeneralRoutingModule } from '../modules/general/general-routing.module';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LoginComponent],
  imports: [CommonModule, HttpClientModule, SharedModule, GeneralRoutingModule],
  exports: [FooterComponent, HeaderComponent],
})
export class CoreModule {}
