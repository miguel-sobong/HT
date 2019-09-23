import { TripService } from '../../core/services/trip/trip.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { TripWithUser } from '../../core/models/trip';

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
    private navController: NavController
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

  goToMapPage() {
    this.navController.navigateForward('map');
  }
}
