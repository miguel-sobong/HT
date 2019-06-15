import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private formBuilder: FormBuilder, private navController: NavController, private authService: AuthService) { }

  loginForm: FormGroup;

  ionViewWillEnter() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  logIn() {
    this.authService.login(this.loginForm.value);
  }

  goToRegisterPage() {
    this.navController.navigateForward('/register');
  }

}
