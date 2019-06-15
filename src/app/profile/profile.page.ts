import { Commuter } from './../core/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../core/services/user/user.service';
import { AuthService } from './../core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: Commuter;
  editProfileForm: FormGroup;
  isLoading = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private loadingController: LoadingController) { }

  ionViewWillEnter() {
    this.initForm();
    this.getUser();
  }

  initForm() {
    this.editProfileForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPassword2: ['', [Validators.required]],
    });
  }

  getUser() {
    this.isLoading = true;
    this.loadingController.create({
      spinner: 'bubbles',
      message: 'Loading...'
    }).then(loader => {
      loader.present();
      const user = this.authService.getCurrentUser();
      this.userService.getUser(user.uid).then(dbUser => {
        this.user = dbUser;
      }).finally(() => { loader.dismiss(); this.isLoading = false; });
    });
  }

}


