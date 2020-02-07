import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { Trip } from 'src/app/core/models/trip';
import { TripState } from 'src/app/core/enums/trip-state';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import * as firebase from 'firebase';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { NavController, ModalController } from '@ionic/angular';
import { ReviewDriverComponent } from '../review-driver/review-driver.component';

@Component({
  selector: 'app-ongoing-trips',
  templateUrl: './ongoing-trips.page.html',
  styleUrls: ['./ongoing-trips.page.scss']
})
export class OngoingTripsPage implements OnInit {
  trips: Trip[] = [];
  tripStates = TripState;
  constructor(
    private tripService: TripService,
    private toaster: ToastService,

    private modalController: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getTrips();
  }
  getTrips() {
    // tslint:disable-next-line:variable-name
    this.tripService.getCommuterTrips().then((commuterTrips: Trip[]) => {
      this.trips = commuterTrips.filter(x => x.state === TripState.Started);
    });
  }

  async reviewDriver(trip: Trip) {
    const jsonTrip = JSON.stringify(trip);

    const modal = await this.modalController.create({
      component: ReviewDriverComponent,
      componentProps: {
        jsonTrip
      }
    });

    modal.onDidDismiss().then(reviewed => {
      if (reviewed.data) {
        trip.isReviewed = true;
      }
    });

    await modal.present();
  }

  endTrip(trip) {
    this.tripService.endTrip(trip.tripId).then(() => {
      this.toaster.success('Ended trip');
      trip.state = TripState.Finished;
      this.reviewDriver(trip);
    });
  }
}
