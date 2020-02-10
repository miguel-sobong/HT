import { ToastService } from './../../core/services/toast/toast.service';
import { TripState } from './../../core/enums/trip-state';
import { AuthService } from './../../core/services/auth/auth.service';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-ongoing-trips',
  templateUrl: './ongoing-trips.component.html',
  styleUrls: ['./ongoing-trips.component.scss']
})
export class OngoingTripsComponent implements OnInit {
  trips: any[] = [];
  tripStates = TripState;
  constructor(
    private tripService: TripService,
    private userService: UserService,
    private authService: AuthService,
    private toaster: ToastService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getTripsWithUser();
  }
  getTripsWithUser() {
    const user = this.authService.getCurrentUser();

    if (user) {
      // tslint:disable-next-line:variable-name
      this.tripService.getTrips().then(commuterTrips => {
        this.trips = [];
        for (const key in commuterTrips) {
          if (
            commuterTrips[key].accepted &&
            commuterTrips[key].driverId === user.uid &&
            (commuterTrips[key].state === TripState.Started ||
              commuterTrips[key].state === TripState.New)
          ) {
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
  }
  startTrip(trip) {
    this.tripService.startTrip(trip.tripId).then(() => {
      this.toaster.success('Started trip');
      this.getTripsWithUser();
    });
  }
}
