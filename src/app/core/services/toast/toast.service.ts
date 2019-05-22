import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastController, private toastCtrl: ToastController) { }

  success(message) {
    const options: ToastOptions = {
      message,
      translucent: true,
      position: 'bottom',
      color: 'success',
      duration: 3000,
    };

    return this.toast.create(options).then(toastData => {
      toastData.present();
    });

  }

  fail(message) {
    const options: ToastOptions = {
      message,
      translucent: true,
      position: 'bottom',
      color: 'warning',
      duration: 3000
    };

    this.toast.create(options).then(toastData => {
      toastData.present();
    });
  }
}
