import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

interface IReviewDetails {
  description: string;
  reviewerId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  route = 'review';

  constructor() {}

  async createReview(driverId: string, reviewDetails: IReviewDetails) {
    return await firebase
      .database()
      .ref(`${this.route}/${driverId}`)
      .push({ ...reviewDetails });
  }
}
