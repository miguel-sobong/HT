import { AuthService } from './../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { IRequestDataForm } from '../../interfaces/IRequestDataForm';
import { ILocation } from '../../interfaces/ILocation';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private toaster: ToastService, private authService: AuthService, private afd: AngularFireDatabase) { }

  createTrip(passengerForm: IRequestDataForm, startLocation: ILocation, endLocation: ILocation) {
    return this.authService.getCurrentUser().then(user => {
      const id = this.afd.createPushId();
      Promise.all([
        this.afd.object(`trips/${id}`).set({
          startLocation: {
            lat: startLocation.lat,
            lng: startLocation.lng
          },
          endLocation: {
            lat: endLocation.lat,
            lng: endLocation.lng
          },
          fare: passengerForm.fare,
          numberOfPassengers: passengerForm.numberOfPassengers,
          commuterId: user.uid
        }),
        this.afd.list(`users/${user.uid}/trips`).push(id)
      ]);
    }).then(() => {
      this.toaster.success('Successfully created trip');
      return Promise.resolve();
    }).catch(() => {
      this.toaster.fail('Failed to creat trip');
      return Promise.reject();
    });
  }
}
