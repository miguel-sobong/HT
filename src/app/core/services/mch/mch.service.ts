import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

export class MCH {
  driver: string;
  operator: string;
  plateNo: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class MchService {
  baseRoute = 'MCH';

  constructor(private afd: AngularFireDatabase) {}

  async getMCHS(): Promise<MCH[]> {
    const queryResults = await firebase
      .database()
      .ref(this.baseRoute)
      .once('value');

    const results = [];

    const mchs = queryResults.val();
    for (const key of Object.keys(mchs)) {
      results.push(mchs[key]);
    }

    return results;
  }

  async getMCH(id: string) {
    return firebase
      .database()
      .ref(`${this.baseRoute}/${id}`)
      .once('value');
  }
}
