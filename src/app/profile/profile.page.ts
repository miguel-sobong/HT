import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../core/services/user/user.service';
import { AuthService } from './../core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: firebase.User;
  editProfileForm: FormGroup;
  isLoading = true;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.editProfileForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPassword2: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    this.isLoading = true;
    return this.authService.getCurrentUser().then(user => {
      this.userService.getUser(user.uid).then(dbUser => {
        this.user = { ...user, ...dbUser };
      });
      // return Promise.resolve(user);
    }).finally(() => {
      this.isLoading = false;
    });
  }

}


