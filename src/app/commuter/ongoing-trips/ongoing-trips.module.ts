import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OngoingTripsPage } from './ongoing-trips.page';
import { ReviewDriverComponent } from '../review-driver/review-driver.component';

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
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [OngoingTripsPage, ReviewDriverComponent],
  entryComponents: [ReviewDriverComponent]
})
export class OngoingTripsPageModule {}
