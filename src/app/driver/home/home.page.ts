import { Component, OnInit } from '@angular/core';
import { TripWithUser } from 'src/app/core/models/trip';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { UserService } from 'src/app/core/services/user/user.service';
import {
  NavController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { TripInfoComponent } from '../trip-info/trip-info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  addTrip = false;
  tripsWithUser: TripWithUser[];
  constructor(
    private tripService: TripService,
    private userService: UserService,
    private modalController: ModalController
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.getTrips();
  }
  getTrips() {
    const promises: Promise<any>[] = [];
    // tslint:disable-next-line:variable-name
    this.tripService.getCommuterTrips().then(commuterTrips => {
      commuterTrips.map(trip => {
        promises.push(this.getUserFromTrip(trip));
      });
      Promise.all(promises).then(trips => {
        this.tripsWithUser = trips;
      });
    });
  }
  async getUserFromTrip(trip: TripWithUser) {
    const userWithTrip = await this.userService.getUser(trip.commuterId);

    const { trips, ...user } = userWithTrip;
    return Promise.resolve({ ...trip, ...user });
  }

  viewTripOnMap(trip: TripWithUser) {
    this.modalController
      .create({
        component: TripInfoComponent,
        componentProps: {
          trip
        }
      })
      .then(result => {
        result.present();
      });
  }
}
