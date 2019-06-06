import { Component } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/services/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  isLoggedIn = false;
  public appPages = [
    {
      title: 'Map',
      url: '/map',
      icon: 'map',
    },
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Profile', 
      url: '/profile',
      icon: 'contact'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private authService: AuthService,
    private navController: NavController,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.checkIfLoggedIn();
    });
  }

  checkIfLoggedIn() {
    this.authService.authenticated().subscribe(user => {
      if (user) {
        this.navController.navigateRoot('/map');
        this.isLoggedIn = true;
      } else {
        this.navController.navigateRoot('/login');
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.menuController.close();
    });
  }
}
