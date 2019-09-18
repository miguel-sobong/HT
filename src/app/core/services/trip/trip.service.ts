import { AuthService } from './../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { IRequestDataForm } from '../../interfaces/IRequestDataForm';
import { ILocation } from '../../interfaces/ILocation';
import { ToastService } from '../toast/toast.service';
import * as firebase from 'firebase';
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor(
    private toaster: ToastService,
    private authService: AuthService,
    private afd: AngularFireDatabase
  ) {}

  async createTrip(
    passengerForm: IRequestDataForm,
    startLocation: ILocation,
    endLocation: ILocation
  ) {
    const user = this.authService.getCurrentUser();
    const id = this.afd.createPushId();
    const endLocationAddress = await this.latLngToAddress(endLocation);
    const startLocationAddress = await this.latLngToAddress(startLocation);
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
        endLocationAddress,
        startLocationAddress,
        fare: passengerForm.fare,
        numberOfPassengers: passengerForm.numberOfPassengers,
        commuterId: user.uid
      }),
      this.afd.list(`users/${user.uid}/trips`).push(id)
    ])
      .then(() => {
        this.toaster.success('Successfully created trip');
        return Promise.resolve();
      })
      .catch(() => {
        this.toaster.fail('Failed to creat trip');
        return Promise.reject();
      });
  }

  getCommuterTrips() {
    const user = this.authService.getCurrentUser();
    return firebase
      .database()
      .ref(`users/${user.uid}/trips`)
      .once('value')
      .then(userTrips => {
        const promises = [];
        const userTripObject = userTrips.val();
        for (const key in userTripObject) {
          if (userTripObject.hasOwnProperty(key)) {
            const tempPromise = firebase
              .database()
              .ref(`trips/${userTripObject[key]}`)
              .once('value')
              .then(commuterTrip => {
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

  getCommuterTripUpdates() {
    const user = this.authService.getCurrentUser();
    return firebase
      .database()
      .ref(`users/${user.uid}/trips`)
      .once('value')
      .then(userTrips => {
        const promises = [];
        const userTripObject = userTrips.val();
        for (const key in userTripObject) {
          if (userTripObject.hasOwnProperty(key)) {
            const tempPromise = firebase
              .database()
              .ref(`trips/${userTripObject[key]}`)
              .once('value')
              .then(commuterTrip => {
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

  latLngToAddress(latLng, delay = 1000): Promise<string> {
    const location = { location: latLng };
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // timeout to bypass OVER_QUERY_LIMIT
        geocoder.geocode(location, (results, status) => {
          if (status === 'OK') {
            if (results) {
              return resolve(results[0].formatted_address);
            }
          }
          return reject('Formatted address not found.');
        });
      }, delay);
    });
  }
}
