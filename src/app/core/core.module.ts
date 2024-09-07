import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

//Components
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";

//Imports Module
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//import { AuthConfigInterceptor } from './config/auth-config.interceptor';
import { LoginComponent } from "./components/login/login.component";
import {
  MsalGuard,
  MsalBroadcastService,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalGuardConfiguration,
  MsalRedirectComponent,
  MsalInterceptor,
  MSAL_INTERCEPTOR_CONFIG,
} from "@azure/msal-angular";
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from "@azure/msal-browser";

import { MSALInterceptorConfigFactory, msalConfig } from "./config/auth-config";

// Import refactor
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LoginComponent],
  imports: [CommonModule, HttpClientModule, SharedModule],
  exports: [FooterComponent, HeaderComponent],
})
export class CoreModule {}
