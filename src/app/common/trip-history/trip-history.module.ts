import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TripHistoryPage } from './trip-history.page';
import { ReviewDriverComponent } from 'src/app/commuter/review-driver/review-driver.component';

const routes: Routes = [
  {
    path: '',
    component: TripHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TripHistoryPage, ReviewDriverComponent],
  entryComponents: [ReviewDriverComponent]
})
export class TripHistoryPageModule {}
