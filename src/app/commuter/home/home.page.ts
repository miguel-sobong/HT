import { TripService } from '../../core/services/trip/trip.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Trip } from '../../core/models/trip';
import { TripState } from 'src/app/core/enums/trip-state';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  addTrip = false;
  tripsWithUser: Trip[];
  constructor(
    private tripService: TripService,
    private navController: NavController
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.getTrips();
  }
  getTrips() {
    // tslint:disable-next-line:variable-name
    this.tripService.getCommuterTrips().then((commuterTrips: Trip[]) => {
      this.tripsWithUser = commuterTrips.filter(
        x =>
          x.state === TripState.New &&
          this.tripService.addMinutes(new Date(x.timestamp), 5) > new Date()
      );
    });
  }

  goToMapPage() {
    this.navController.navigateForward('map');
  }
}
