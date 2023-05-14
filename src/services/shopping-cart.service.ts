import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ProductItem } from '../models/product-item';
import { IUser } from 'src/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  userShoppingCart: ReplaySubject<ProductItem[]> = new ReplaySubject<ProductItem[]>(1);

  constructor() {
    this._loadCart();
  }

  addToCart(product: ProductItem) {
    const user = this._currentUser;
    if (!user) {
      return;
    }
    user?.shoppingCart.push(product);
    this._saveCart(user);
  }

  removeFromCart(productId: number) {
    let user = this._currentUser;
    if (user) {
      user.shoppingCart = user.shoppingCart.filter((item: ProductItem) => item.productId != productId);
    }
    console.log('@@ user2 ', user)
    this._saveCart(user);
  }

  get currentShoppingCart(): ProductItem[] {
    let user = this._currentUser;
    console.log('@@ ddd ', user)
    if (!user) {
      return [];
    }
    return user?.shoppingCart;
  }

  private _saveCart(user: IUser | undefined) {
    let users = JSON.parse(localStorage.getItem('users') ?? '[]');
    users = users.filter((user: IUser) => user.id != user.id);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    this.userShoppingCart.next((user?.shoppingCart?? []) as ProductItem[]);
  }

  private _loadCart() {
    const user = this._currentUser;
    this.userShoppingCart.next((user?.shoppingCart?? []) as ProductItem[]);
  }

  private get _currentUser(): IUser | undefined {
    const users: IUser[] = JSON.parse(localStorage.getItem('users') ?? '[]') as IUser[];
    console.log('@@ users ', users)
    const accountId = JSON.parse(localStorage.getItem('accountId') ?? '0');
    console.log('@@ accountId ', accountId)
    const user = users.find(user => user.id == accountId);
    return user;
  }
}
