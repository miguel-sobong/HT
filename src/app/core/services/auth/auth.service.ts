import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ILoginForm } from '../../interfaces/ILoginForm';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afa: AngularFireAuth,
    private toast: ToastService,
    private userService: UserService
  ) {}

  getCurrentUser() {
    return this.afa.auth.currentUser;
  }

  login(form: ILoginForm) {
    let { email } = form;
    const { password } = form;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      email = `${email}@htdriver.com`;
    }

    console.log(email, password);

    return this.afa.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.toast.success(`Logged in successfully as ${email}`);
        return Promise.resolve(user);
      })
      .catch(error => {
        this.toast.fail(error.message);
        return Promise.reject(error);
      });
  }

  logout() {
    return Promise.all([this.afa.auth.signOut(), this.userService.logoutUser()])
      .then(() => {
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
      });
  }

  authenticated() {
    return this.afa.authState;
  }

  changePassword(password: string) {
    return this.getCurrentUser().updatePassword(password);
  }
}
