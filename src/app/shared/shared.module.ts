import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastComponent } from './components/toast/toast.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastComponent,
    MatProgressSpinnerModule
  ],
})
export class SharedModule {}
