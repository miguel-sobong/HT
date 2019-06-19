import { AuthService } from './../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { IRequestDataForm } from '../../interfaces/IRequestDataForm';
import { ILocation } from '../../interfaces/ILocation';
import { ToastService } from '../toast/toast.service';
import * as firebase from 'firebase';
import { resolve } from 'q';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private toaster: ToastService, private authService: AuthService, private afd: AngularFireDatabase) { }

  createTrip(passengerForm: IRequestDataForm, startLocation: ILocation, endLocation: ILocation) {
    const user = this.authService.getCurrentUser();
    const id = this.afd.createPushId();
    return Promise.all([
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
    ]).then(() => {
      this.toaster.success('Successfully created trip');
      return Promise.resolve();
    }).catch(() => {
      this.toaster.fail('Failed to creat trip');
      return Promise.reject();
    });
  }

  getCommuterTrips() {
    const user = this.authService.getCurrentUser();
    return firebase.database().ref(`users/${user.uid}/trips`).once('value').then(userTrips => {
      const promises = [];
      const userTripObject = userTrips.val();
      for (const key in userTripObject) {
        if (userTripObject.hasOwnProperty(key)) {
          const tempPromise = firebase.database().ref(`trips/${userTripObject[key]}`).once('value').then(commuterTrip => {
            return Promise.resolve(commuterTrip.val());
          });
          promises.push(tempPromise);
        }
      }
      return Promise.all(promises).then(trips => {
        return Promise.resolve(trips);
      });
    });
  }
}
