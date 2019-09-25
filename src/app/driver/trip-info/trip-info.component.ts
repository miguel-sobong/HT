import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { TripWithUser } from 'src/app/core/models/trip';

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {
  @Input() trip: TripWithUser;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  goBack() {
    this.modalController.dismiss();
  }
}
