import { ILocation } from '../interfaces/ILocation';

export class Trip {
    commuterId: string;
    endLocation: ILocation;
    fare: number;
    numberOfPassengers: number;
    startLocation: ILocation;
}
