import { ILocation } from '../interfaces/ILocation';

export class Trip {
  commuterId: string;
  endLocation: ILocation;
  fare: number;
  numberOfPassengers: number;
  startLocation: ILocation;
  accepted: boolean;
  started: boolean;
  startedDate: string;
}

export class TripWithUser extends Trip {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userType: 'commuter' | 'driver';
  endLocationAddress: string;
  startLocationAddress: string;
  id: string;
}
