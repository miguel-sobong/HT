import { AuthService } from './../../core/services/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
declare const google: any;

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {
  @Input() trip: any;
  @ViewChild('map') mapElement: { nativeElement: Element };
  map: any;
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  startMarker: any;
  endMarker: any;
  constructor(
    private modalController: ModalController,
    private tripService: TripService,
    private toaster: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.initMap();
  }
  goBack() {
    this.modalController.dismiss();
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
      icon: 'http://www.google.com/mapfiles/markerA.png',
      position: this.trip.startLocation
    });
    this.endMarker = new google.maps.Marker({
      icon: 'http://www.google.com/mapfiles/markerZ.png',
      position: this.trip.endLocation
    });
    this.startMarker.setMap(this.map);
    this.endMarker.setMap(this.map);
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
  acceptTrip() {
    return this.tripService
      .acceptTrip(this.trip.tripId, this.authService.getCurrentUser().uid)
      .then(result => {
        this.toaster.success('Accepted trip');
        this.goBack();
      })
      .catch(error => {
        this.goBack();
        this.toaster.fail(error.message);
      });
  }
}
