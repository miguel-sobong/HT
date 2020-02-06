import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Trip } from 'src/app/core/models/trip';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripService } from 'src/app/core/services/trip/trip.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ReviewService } from 'src/app/core/services/review/review.service';

@Component({
  selector: 'app-review-driver',
  templateUrl: './review-driver.component.html',
  styleUrls: ['./review-driver.component.scss']
})
export class ReviewDriverComponent implements OnInit {
  trip: Trip;
  reviewDriverForm: FormGroup;
  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private tripService: TripService,
    private toastService: ToastService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.trip = JSON.parse(this.navParams.get('jsonTrip'));
    this.initForm();
  }

  initForm() {
    this.reviewDriverForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      reviewerId: [this.trip.commuterId, [Validators.required]]
    });
  }

  submit() {
    Promise.all([
      this.tripService
        .editTrip(this.trip.tripId, { isReviewed: true })
        .then(() => {
          this.toastService.success(`Successfully reviewed driver!`);
          this.modalController.dismiss(true);
        })
        .catch(() => {
          this.toastService.fail(`Error encounter during submit`);
        }),

      this.reviewService.createReview(
        this.trip.driverId,
        this.reviewDriverForm.value
      )
    ]);
  }

  cancel() {
    this.modalController.dismiss(false);
  }
}
