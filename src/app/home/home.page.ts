import { TripService } from './../core/services/trip/trip.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  addTrip = false;
  trips: any;
  constructor(private tripService: TripService, private userService: UserService, private navController: NavController) { }
  ngOnInit() {
    this.getTrips();
  }
  getTrips() {
    this.tripService.getCommuterTrips().then(trips => {
      this.trips = trips;
      console.log(this.trips);
    });
  }
  goToMapPage() {
    this.navController.navigateForward('map');
  }

}
