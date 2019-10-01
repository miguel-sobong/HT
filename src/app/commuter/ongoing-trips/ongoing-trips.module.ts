import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OngoingTripsPage } from './ongoing-trips.page';

const routes: Routes = [
  {
    path: '',
    component: OngoingTripsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OngoingTripsPage]
})
export class OngoingTripsPageModule {}
