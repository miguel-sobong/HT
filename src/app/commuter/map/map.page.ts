import { UserService } from './../../core/services/user/user.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ToastService } from '../../core/services/toast/toast.service';
import { TripService } from '../../core/services/trip/trip.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import * as firebase from 'firebase';
import { User } from 'src/app/core/models/user';
import { TripState } from 'src/app/core/enums/trip-state';
import { TripAcceptedComponent } from 'src/app/common/trip-accepted/trip-accepted.component';
declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})
export class MapPage implements OnInit {
  @ViewChild('map') mapElement: { nativeElement: Element };
  startMarker: any;
  endMarker: any;
  map: any;
  settingStartMarker = true;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  autocompleteService = new google.maps.places.AutocompleteService();

  @ViewChild('searchbar') searchBar: any;
  searchResults: any[] = [];
  userKey: string | undefined;

  constructor(
    private toastService: ToastService,
    private alertController: AlertController,
    private tripService: TripService,
    private authService: AuthService,
    private userService: UserService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getUser();
    this.initMap();
    this.getTripUpdates();
  }

  getUser() {
    const subs = this.authService.authenticated().subscribe(authUser => {
      if (authUser) {
        this.userKey = authUser.uid;
        subs.unsubscribe();
      }
    });
  }

  getTripUpdates() {
    firebase
      .database()
      .ref(`users`)
      .off();
    this.authService.authenticated().subscribe(authUser => {
      if (authUser) {
        this.userService.getUser(authUser.uid).then((user: User) => {
          return firebase
            .database()
            .ref(`users/${user.id}/trips`)
            .once('value')
            .then(result => {
              const trips = result.val();
              for (const key in trips) {
                if (trips.hasOwnProperty(key)) {
                  firebase
                    .database()
                    .ref(`trips/${trips[key]}`)
                    .on('child_changed', async changes => {
                      if (changes.key === 'accepted') {
                        if (changes.val()) {
                          // this.toastService.success('A trip has been accepted');
                          const trip = await this.tripService.getTrip(
                            trips[key]
                          );

                          const modal = await this.modalController.create({
                            component: TripAcceptedComponent,
                            componentProps: {
                              trip
                            },
                            cssClass: 'trip-accepted'
                          });

                          modal.present();
                        }
                      } else if (changes.key === 'state') {
                        if (changes.val() === TripState.Started) {
                          this.toastService.success('A trip has been started');
                        } else if (changes.val() === TripState.Finished) {
                          this.toastService.success('A trip has been finished');
                        }
                      }
                    });
                }
              }
            });
        });
      } else {
        firebase
          .database()
          .ref(`users`)
          .off();
      }
    });
  }
  searchMap(ev: any) {
    const searchText = ev.target.value;
    this.searchResults = [];
    if (!searchText) {
      return;
    }

    const options = {
      input: searchText,
      componentRestrictions: { country: 'ph' }
    };

    this.autocompleteService.getPlacePredictions(
      options,
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          predictions.forEach(prediction => {
            this.searchResults.push(prediction);
          });
        }
      }
    );
  }

  goToLocation(placeId: string) {
    const placesService = new google.maps.places.PlacesService(this.map);

    placesService.getDetails({ placeId }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.map.setCenter(place.geometry.location);
        this.clearSearchQueryAndResults();
        this.placeMarker(place.geometry.location);
      }
    });
  }

  placeMarker(location: any) {
    // adds start marker first then end marker then start marker again...
    if (this.settingStartMarker) {
      this.startMarker.setPosition(location);
    } else {
      this.endMarker.setPosition(location);
    }

    if (this.startMarker.getPosition() && this.endMarker.getPosition()) {
      this.drawRoute();
    }
    this.settingStartMarker = !this.settingStartMarker;
  }

  drawRoute() {
    // clears previous route
    // this.directionsDisplay.setMap(null);

    const request = {
      origin: this.startMarker.getPosition().toJSON(),
      destination: this.endMarker.getPosition(),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setDirections(response);
      }
    });
  }

  clearSearchQueryAndResults() {
    this.searchResults = [];
    this.searchBar._value = this.searchBar.el.value = '';
  }

  initMap() {
    const coords = new google.maps.LatLng(9.3068, 123.3054); // replace to current location in the future

    const mapOptions = {
      center: coords,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.directionsDisplay.setOptions({ suppressMarkers: true });

    this.initMapMarkers();
  }

  initMapMarkers() {
    this.startMarker = new google.maps.Marker({
      icon: 'http://www.google.com/mapfiles/markerA.png'
    });
    this.endMarker = new google.maps.Marker({
      icon: 'http://www.google.com/mapfiles/markerZ.png'
    });

    this.startMarker.setMap(this.map);
    this.endMarker.setMap(this.map);

    this.map.addListener('click', e => {
      this.placeMarker(e.latLng);
    });
  }

  async addTravel() {
    const alert = await this.alertController.create({
      header: 'Travel Information',
      inputs: [
        {
          name: 'numberOfPassengers',
          placeholder: 'Number of Passengers',
          type: 'number',
          min: '1'
        },
        {
          name: 'fare',
          placeholder: 'Fare',
          type: 'number',
          min: '1'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Request',
          handler: async data => {
            if (!data.fare || !data.numberOfPassengers) {
              this.toastService.fail('Both fields are required');
              return;
            }

            if (!this.userKey) {
              return;
            }

            const user = await this.userService.getUser(this.userKey);
            const time = await this.tripService.getTime();
            console.log(
              user.lastRequestTime,
              this.tripService.addMinutes(new Date(time), 5)
            );

            if (user && !user.canRequest) {
              if (
                this.tripService.addMinutes(new Date(user.lastRequestTime), 5) <
                time
              ) {
                return Promise.all([
                  // add to firebase
                  this.tripService
                    .createTrip(
                      data,
                      this.startMarker.getPosition().toJSON(),
                      this.endMarker.getPosition().toJSON()
                    )
                    .then(() => {
                      this.startMarker.setPosition(null);
                      this.endMarker.setPosition(null);
                      this.getTripUpdates();
                    }),

                  this.userService.updateUser(this.userKey, {
                    canRequest: false,
                    lastRequestTime: time
                  })
                ]);
              } else {
                // tslint:disable-next-line: quotemark
                this.toastService.fail(
                  'Please wait for 5 mins since last requested until requesting again.'
                );
                return;
              }
            }
          }
        }
      ]
    });
    alert.present();
  }
}
