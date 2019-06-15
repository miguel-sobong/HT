import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{
  addTrip = false;
  constructor(private userService: UserService, private navController: NavController) { }

  goToMapPage() {
    this.navController.navigateForward('map');
  }

}
