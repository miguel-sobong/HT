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

  createCommuter(form: IRegisterForm) {
    this.createOnAngularFireAuth(form).then(user => {
      this.createOnAngularFireDb(form, user.user.uid).then(res => {
        this.toast.success(`Successfully registered as ${form.email}`);
      });
    });
  }
  createOnAngularFireDb(form: IRegisterForm, userId) {
    return this.afd.object(`users/${userId}`).set({
      firstName: form.firstName,
      lastName: form.lastName,
      mobileNumber: form.mobileNumber,
      email: form.email,
      userType: 'commuter'
    });
  }

  createOnAngularFireAuth(form: IRegisterForm) {
    return this.afa.auth.createUserWithEmailAndPassword(form.email, form.password).then(user => {
      return Promise.resolve(user);
    }).catch(error => {
      let message: string;
      switch (error.code) {
        case 'auth/invalid-email': message = `Email ${form.email} has an invalid format`; break;
        case 'auth/email-already-in-use': message = `Email ${form.email} is already taken`; break;
        case 'auth/weak-password': message = `Password is not strong enough`; break;
        default: message = error.message;
      }
      this.toast.fail(message);
      return Promise.reject(error);
    });
  }

  async getUserType() {
    const uid = await this.afa.auth.currentUser.uid;
    return await this.afd.object(`users/${uid}`).valueChanges().subscribe(user => {
      return Promise.resolve(user);
    });
  }

  getUser(userId: number) {
    return this.afd.object(`users/${userId}`);
  }
}
