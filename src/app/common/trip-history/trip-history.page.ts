import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { Trip } from 'src/app/core/models/trip';
import { TripState } from 'src/app/core/enums/trip-state';
import { ModalController } from '@ionic/angular';
import { ReviewDriverComponent } from 'src/app/commuter/review-driver/review-driver.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { User, UserTypes } from 'src/app/core/models/user';

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.page.html',
  styleUrls: ['./trip-history.page.scss']
})
export class TripHistoryPage implements OnInit {
  user: User;
  trips: Trip[] = [];
  tripStates = TripState;
  userTypes = UserTypes;

  constructor(
    private tripService: TripService,
    private modalController: ModalController,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    Promise.all([this.getCurrentUser(), this.getTrips()]);
  }

  async getCurrentUser() {
    const user = this.authService.getCurrentUser();
    return this.userService.getUser(user.uid).then(dbUser => {
      this.user = dbUser;
    });
  }

  getTrips() {
    // tslint:disable-next-line:variable-name
    return this.tripService.getCommuterTrips().then((commuterTrips: Trip[]) => {
      this.trips = commuterTrips.filter(x => x.state === TripState.Finished);
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
}
