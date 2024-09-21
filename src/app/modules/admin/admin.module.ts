import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [],
})
export class AdminModule {}
