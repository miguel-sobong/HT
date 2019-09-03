import { User, UserTypes } from './core/models/user';
import { Component } from '@angular/core';

import {
  Platform,
  NavController,
  MenuController,
  AlertController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/services/auth/auth.service';
import { UserService } from './core/services/user/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  isLoggedIn;
  public appPages = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navController: NavController,
    private menuController: MenuController,
    private alertController: AlertController,
    private userService: UserService
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
    this.authService.authenticated().subscribe(authUser => {
      if (authUser) {
        this.userService.getUser(authUser.uid).then((user: User) => {
          switch (user.userType) {
            case UserTypes.Commuter: {
              this.appPages = [
                {
                  title: 'Map',
                  url: '/map',
                  icon: 'map'
                },
                {
                  title: 'My Trips',
                  url: '/home',
                  icon: 'home'
                },
                {
                  title: 'Profile',
                  url: '/profile',
                  icon: 'contact'
                },
                {
                  title: 'About',
                  url: '/about',
                  icon: 'information-circle'
                }
              ];
              break;
            }

            case UserTypes.Driver: {
              this.appPages = [
                {
                  title: 'Trips',
                  // component: 'TripRequestPage',
                  icon: 'ios-timer'
                },
                {
                  title: 'Ongoing Trips',
                  // component: 'OngoingPage',
                  icon: 'car'
                },
                {
                  title: 'Profile',
                  // component: 'EditProfilePage',
                  icon: 'ios-contact'
                }
              ];
            }
          }
        });
        this.navController.navigateRoot('/map');
        this.isLoggedIn = true;
      } else {
        this.navController.navigateRoot('/login');
        this.isLoggedIn = false;
      }
    });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Do you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.authService.logout().then(() => {
              this.menuController.close();
            });
          }
        }
      ]
    });
    return await alert.present();
  }
}
