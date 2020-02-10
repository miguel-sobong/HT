import { ILocation } from '../interfaces/ILocation';
import { TripState } from '../enums/trip-state';

export class Trip {
  commuterId: string;
  endLocation: ILocation;
  fare: number;
  numberOfPassengers: number;
  startLocation: ILocation;
  accepted: boolean;
  state: TripState;
  startedDate: string;
  driverId: string;
  endLocationAddress: string;
  startLocationAddress: string;
  timestamp: Date;
  tripId?: string;
  isReviewed: boolean;
  date: Date;
}

export class TripWithUser extends Trip {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userType: 'commuter' | 'driver';
  id: string;
}
