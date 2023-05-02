import { Injectable } from "@angular/core";
import { IUser } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  account: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  register(login: string, email: string, password: string): Promise<boolean> {
    const usersString = localStorage.getItem('users');
    const users = usersString !== null ? JSON.parse(usersString) : [];

    const maxId = users.reduce(
      (max: number, user: IUser) => user.id !== undefined && user.id > max ? user.id : max, 0
    );
    const newId = maxId + 1;

    const newUser: IUser = { id: newId, login, email, password };

    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));

    this.setAuthStatus(true);
    this.setAccountId(newId);
    return Promise.resolve(true);
  }

  login(login: string, email: string, password: string): Promise<boolean> {
    const usersString = localStorage.getItem('users');
    const users = usersString !== null ? JSON.parse(usersString) : [];

    const userIndex = users.findIndex((user: IUser) => user.email === email);

    if (
      userIndex !== -1
      && users[userIndex].login === login
      && users[userIndex].email === email
      && users[userIndex].password === password
    ) {
      this.setAuthStatus(true);
      this.setAccountId(users[userIndex].id)
      return Promise.resolve(true);
    } else {
      this.setAuthStatus(false);
      this.setAccountId(0);
      return Promise.reject(new Error('Введені дані не вірні, спробуйте ще раз!'))
    }
  }

  logout(): Promise<boolean> {
    this.setAuthStatus(false);
    this.setAccountId(0);
    return Promise.resolve(true);
  }

  setAuthStatus(isAuthenticated: boolean) {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    this.isAuthenticated.next(isAuthenticated);
  }

  getAuthStatus(): boolean {
    let isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    return isAuthenticated;
  }

  setAccountId(id: number) {
    localStorage.setItem('account', id.toString());
    this.account.next(localStorage.getItem('account'));
  }

  getAccountId() {
    const authorId = JSON.parse(localStorage.getItem('account') ?? '');
    return authorId;
  }
}
