import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { IRegisterForm } from '../../interfaces/IRegisterForm';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase,
    private toast: ToastService
  ) { }

  createUser(form: IRegisterForm) {
    this.afa.auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(res => {
        this.toast.success(`Successfully registered as ${form.email}`);
      })
      .catch(error => {
        let message: string;
        switch (error.code) {
          case 'auth/invalid-email': message = `Email ${form.email} has an invalid format`; break;
          case 'auth/email-already-in-use': message = `Email ${form.email} is already taken`; break;
          case 'auth/weak-password': message = `Password is not strong enough`; break;
          default: message = error.message;
        }

        this.toast.fail(message);
      });
  }
}
