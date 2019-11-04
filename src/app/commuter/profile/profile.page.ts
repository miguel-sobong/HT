import { User } from '../../core/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user/user.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Component } from '@angular/core';
import {
  LoadingController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  user: User;
  editProfileForm: FormGroup;
  isLoading = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    public modalController: ModalController
  ) {}

  ionViewWillEnter() {
    this.initForm();
    this.getUser();
  }

  initForm() {
    this.editProfileForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPassword2: ['', [Validators.required]]
    });
  }

  getUser() {
    this.isLoading = true;
    this.loadingController
      .create({
        spinner: 'bubbles',
        message: 'Loading...'
      })
      .then(loader => {
        loader.present();
        const user = this.authService.getCurrentUser();
        this.userService
          .getUser(user.uid)
          .then(dbUser => {
            this.user = dbUser;
          })
          .finally(() => {
            loader.dismiss();
            this.isLoading = false;
          });
      });
  }

  async changeNumber() {
    const alert = await this.alertController.create({
      header: 'Change Mobile Number',
      inputs: [
        {
          name: 'mobileNumber',
          value: this.user.mobileNumber
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Change',
          handler: data => {
            const user = this.authService.getCurrentUser();
            this.userService
              .changeMobileNumber(user.uid, data.mobileNumber)
              .then(() => {
                this.getUser();
              });
          }
        }
      ]
    });
    alert.present();
  }

  async changePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordFormComponent
    });

    modal.present();
  }
}
