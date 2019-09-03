import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../core/services/toast/toast.service';
import { TripService } from '../../core/services/trip/trip.service';
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

  @ViewChild('searchbar') searchBar: any;
  searchResults: any[] = [];

  constructor(
    private toastService: ToastService,
    private alertController: AlertController,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  searchMap(ev: any) {
    const searchText = ev.target.value;
    this.searchResults = [];
    if (!searchText) {
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();
    const options = {
      input: searchText,
      componentRestrictions: { country: 'ph' }
    };

    autocompleteService.getPlacePredictions(options, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        predictions.forEach(prediction => {
          this.searchResults.push(prediction);
        });
      }
    });
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
          handler: data => {
            if (!data.fare || !data.numberOfPassengers) {
              this.toastService.fail('Both fields are required');
              return;
            }

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
              });
          }
        }
      ]
    });
    alert.present();
  }
}
