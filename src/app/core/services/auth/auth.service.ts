import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ILoginForm } from '../../interfaces/ILoginForm';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth, private toast: ToastService) {}

  async getCurrentUser() {
    return this.afa.auth.currentUser;
  }

  login(form: ILoginForm) {
    const { email, password } = form;
    return this.afa.auth.signInWithEmailAndPassword(email, password).then(user => {
      this.toast.success(`Logged in successfully as ${email}`);
      return Promise.resolve(user);
    }).catch(error => {
      this.toast.fail(`Logging in unsuccessful`);
      return Promise.reject(error);
    });

  }

  logout() {
    return this.afa.auth.signOut().then(user => {
      return Promise.resolve(user);
    }).catch(error => {
      return Promise.reject(error);
    });
  }

  authenticated() {
    return this.afa.authState;
  }
}
