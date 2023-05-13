import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductItem } from '../models/product-item';
import { IUser } from 'src/interfaces/user';
import { UserActions } from 'src/enums/user-actions.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: BehaviorSubject<{ actions: any[], userId: number }> = new BehaviorSubject<any>({ actions: [], userId: 0 });

  constructor() {
    this._loadNotifications;
    this._loadUserData();
  }

  private _loadUserData() {
    const accountId = JSON.parse(localStorage.getItem('account') ?? '0');
    const user = JSON.parse(localStorage.getItem('users') ?? '[]');
    this.user.next(user.find((user: IUser) => user.id == accountId));
  }

  addNotification(action: UserActions) {
    const users: IUser[] = this._getUsers;
    const accountId = JSON.parse(localStorage.getItem('account') ?? '0');
    let currentUser: any;
    if (users.length && +accountId) {
      currentUser = users.find(user => user.id == accountId);
    } else {
      console.log('@@ error ');
      return;
    }
    currentUser?.actions?.push(action);
    this._saveNotification(currentUser);
  }

  cleanAllNotifications() {
    const users: IUser[] = this._getUsers;
    const accountId = JSON.parse(localStorage.getItem('account') ?? '0');
    let currentUser: any;
    if (users.length && +accountId) {
      currentUser = users.find((user) => user.id == accountId);
    } else {
      console.log('@@ error ');
      return;
    }
    currentUser?.actions?.splice(0, currentUser.actions.length);
    this._saveNotification(currentUser);
  }

  private _saveNotification(updatedUserActions: IUser[]) {
    localStorage.setItem('users', JSON.stringify(updatedUserActions));
    this.user.next(this._getUsers);
  }

  private _loadNotifications() {
    this.user.next(this._getUsers);
  }

  private get _getUsers() {
    return JSON.parse(localStorage.getItem('users') ?? '[]');
  }
}
