import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArViewerPageRoutingModule } from './ar-viewer-routing.module';

import { ArViewerPage } from './ar-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArViewerPageRoutingModule
  ],
  declarations: [ArViewerPage]
})
export class ArViewerPageModule {}
