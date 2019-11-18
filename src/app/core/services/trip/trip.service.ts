import { AuthService } from './../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { IRequestDataForm } from '../../interfaces/IRequestDataForm';
import { ILocation } from '../../interfaces/ILocation';
import { ToastService } from '../toast/toast.service';
import * as firebase from 'firebase';
import { Trip } from '../../models/trip';
import { TripState } from '../../enums/trip-state';
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
        commuterId: user.uid,
        accepted: false,
        state: TripState.New,
        startedAt: '',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }),
      this.afd.list(`users/${user.uid}/trips`).push(id)
    ])
      .then(() => {
        this.toaster.success('Successfully created trip');
        return Promise.resolve();
      })
      .catch(() => {
        this.toaster.fail('Failed to create trip');
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

  getTrips() {
    return firebase
      .database()
      .ref(`trips`)
      .once('value')
      .then(result => {
        return Promise.resolve(result.val() as Trip[]);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  startTrip(tripId) {
    return firebase
      .database()
      .ref(`trips/${tripId}`)
      .once('value')
      .then(result => {
        return this.afd.object(`trips/${tripId}`).update({
          state: TripState.Started
        });
      });
  }

  endTrip(tripId) {
    return firebase
      .database()
      .ref(`trips/${tripId}`)
      .once('value')
      .then(result => {
        return this.afd.object(`trips/${tripId}`).update({
          state: TripState.Finished
        });
      });
  }

  getTripDbReference() {
    return firebase.database().ref('trips');
  }

  acceptTrip(tripId, driverId) {
    return firebase
      .database()
      .ref(`trips/${tripId}`)
      .once('value')
      .then(result => {
        if (result.val().accepted) {
          throw new Error('Trip is already accepted by another driver');
        }

        this.getTime().then(currentDate => {
          if (
            this.addMinutes(new Date(result.val().timestamp), 5) > currentDate
          ) {
            throw new Error(
              'Trip is already more than 5 minutes since creation.'
            );
          }

          return this.afd.object(`trips/${tripId}`).update({
            accepted: true,
            driverId
          });
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

  getTrip(tripId: number) {
    return firebase
      .database()
      .ref(`trips/${tripId}`)
      .once('value')
      .then(trip => {
        return Promise.resolve(trip.val());
      });
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000).getTime();
  }

  getTime() {
    return fetch('http://worldtimeapi.org/api/timezone/Asia/Manila')
      .then(response => response.json())
      .then(dateTime => {
        return new Date(dateTime.datetime).getTime();
      });
  }
}
