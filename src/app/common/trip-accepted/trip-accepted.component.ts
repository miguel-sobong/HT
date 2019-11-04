import { User } from 'src/app/core/models/user';
import { UserService } from './../../core/services/user/user.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Trip } from 'src/app/core/models/trip';

@Component({
  selector: 'app-trip-accepted',
  templateUrl: './trip-accepted.component.html',
  styleUrls: ['./trip-accepted.component.scss']
})
export class TripAcceptedComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private userService: UserService
  ) {}
  @Input() trip: Trip;
  driver: User;
  isLoading = true;

  ngOnInit() {
    this.getDriverUserDetail();
  }

  async getDriverUserDetail() {
    this.isLoading = true;
    this.driver = await this.userService.getUser(this.trip.driverId);
    console.log(this.driver);
    this.isLoading = false;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
