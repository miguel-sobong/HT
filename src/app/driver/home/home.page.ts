import { Component, OnInit } from '@angular/core';
import { TripWithUser } from 'src/app/core/models/trip';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ModalController } from '@ionic/angular';
import { TripInfoComponent } from '../trip-info/trip-info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  addTrip = false;
  tripsWithUser: TripWithUser[];
  trips: any[] = [];
  constructor(
    private tripService: TripService,
    private userService: UserService,
    private modalController: ModalController
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.getTripsWithUser();
    this.getTripsUpdate();
  }
  ionViewWillLeave() {
    this.tripService.getTripDbReference().off();
  }
  getTripsUpdate() {
    this.tripService.getTripDbReference().on('child_changed', () => {
      this.getTripsWithUser();
    });
  }
  getTripsWithUser() {
    this.trips = [];
    // tslint:disable-next-line:variable-name
    this.tripService.getTrips().then(commuterTrips => {
      for (const key in commuterTrips) {
        if (!commuterTrips[key].accepted) {
          if (commuterTrips.hasOwnProperty(key)) {
            this.userService
              .getUser(commuterTrips[key].commuterId)
              .then(result => {
                this.trips.push({
                  ...commuterTrips[key],
                  tripId: key,
                  ...result
                });
              });
          }
        }
      }
    });
  }
  async getUserFromTrip(trip: TripWithUser) {
    const userWithTrip = await this.userService.getUser(trip.commuterId);

    const { trips, ...user } = userWithTrip;
    return Promise.resolve({ ...trip, ...user });
  }

  async viewTripOnMap(trip: TripWithUser) {
    const modal = await this.modalController.create({
      component: TripInfoComponent,
      componentProps: {
        trip
      }
    });
    modal.onDidDismiss().then(() => {
      this.getTripsWithUser();
    });
    modal.present();
  }
}
