import { AuthService } from './../../core/services/auth/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {
  changePasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit() {
    const { newPassword, confirmPassword } = this.changePasswordForm.controls;

    if (!newPassword.value.length) {
      this.showOkAlert('New password is empty');
    } else if (!confirmPassword.value.length) {
      this.showOkAlert('Confirm password is empty');
    } else if (newPassword.value !== confirmPassword.value) {
      this.showOkAlert('New password and confirm password does not match');
    }

    this.authService
      .changePassword(newPassword.value)
      .then(() => {
        this.showOkAlert('Password changed');
        this.modalController.dismiss();
      })
      .catch(error => {
        this.showOkAlert(error.message);
      });
  }

  showOkAlert(header: string, message = '') {
    this.alertController
      .create({
        header: `${header}`,
        message: `${message}`,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel'
          }
        ]
      })
      .then(result => {
        result.present();
      });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
