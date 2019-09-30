import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { OngoingTripsComponent } from './ongoing-trips.component';

const routes: Routes = [
  {
    path: '',
    component: OngoingTripsComponent
  }
];

@NgModule({
  declarations: [OngoingTripsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class OngoingTripsModule {}
