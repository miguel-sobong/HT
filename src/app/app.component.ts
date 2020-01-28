import { User, UserTypes } from './core/models/user';
import { DriverStatus } from './core/enums/driver-status';
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
import { ToastService } from './core/services/toast/toast.service';

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
    private userService: UserService,
    private toastService: ToastService
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
              if (!authUser.emailVerified) {
                authUser.sendEmailVerification();
                break;
              }

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
                  title: 'Ongoing Trips',
                  url: '/ongoing-trips',
                  icon: 'car'
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
              this.navController.navigateRoot('/map');
              break;
            }

            case UserTypes.Driver: {
              if (user.status === DriverStatus.Deactivated) {
                this.authService.logout().then(() => {
                  this.navController.navigateRoot('/login');
                });
                this.toastService.fail('Your account has been deactivated');
                break;
              }

              this.appPages = [
                {
                  title: 'Trips',
                  url: '/driver/home',
                  icon: 'map'
                },
                {
                  title: 'Accepted Trips',
                  url: '/driver/ongoing-trips',
                  icon: 'car'
                }
              ];
              this.navController.navigateRoot('/driver/home');
              break;
            }
          }
        });
        this.menuController.enable(true);
      } else {
        this.navController.navigateRoot('/login');
        this.menuController.enable(false);
        this.menuController.close();
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
              this.navController.navigateRoot('/login');
            });
          }
        }
      ]
    });
    return await alert.present();
  }
}
