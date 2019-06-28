import { TripService } from './../core/services/trip/trip.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';
import { ILocation } from '../core/interfaces/ILocation';
import { Trip } from '../core/models/trip';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  addTrip = false;
  trips: Trip[];
  constructor(private tripService: TripService, private userService: UserService, private navController: NavController) { }
  ngOnInit() {
    this.getTrips();
  }
  getTrips() {
    const promises: Promise<any>[] = [];
    // tslint:disable-next-line:variable-name
    this.tripService.getCommuterTrips().then(_trips => {
      _trips.map(trip => {
        promises.push(this.getUserFromTrip(trip));
      });
      Promise.all(promises).then(trips => {
        this.trips = trips;
      });
    });
  }
  async getUserFromTrip(trip: Trip) {
    const user = await this.userService.getUser(trip.commuterId);
    return Promise.resolve({ ...trip, ...user });
  }

  goToMapPage() {
    this.navController.navigateForward('map');
  }
}

