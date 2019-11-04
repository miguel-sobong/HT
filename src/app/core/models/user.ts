export enum UserTypes {
  Commuter = 'commuter',
  Driver = 'driver'
}

export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserTypes;
  mobileNumber: string;
}
