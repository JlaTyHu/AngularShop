import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductItem } from '../models/product-item';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  shoppingCart: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this._loadCart();
  }

  addToCart(product: ProductItem) {
    const itemList: ProductItem[] = JSON.parse(
      localStorage.getItem('shoppingCart') ?? '[]'
    );
    itemList.push(product);
    this._saveCart(itemList);
  }

  removeFromCart(index: number) {
    const itemList: ProductItem[] = JSON.parse(
      localStorage.getItem('shoppingCart') ?? '[]'
    );
    const newItemList = itemList.filter((item) => item.productId != index);
    this._saveCart(newItemList);
  }

  private _saveCart(item: ProductItem[]) {
    localStorage.setItem('shoppingCart', JSON.stringify(item));
    this.shoppingCart.next(this._getCart);
  }

  private _loadCart() {
    this.shoppingCart.next(
      JSON.parse(localStorage.getItem('shoppingCart') ?? '[]')
    );
  }

  private get _getCart() {
    return JSON.parse(localStorage.getItem('shoppingCart') ?? '[]');
  }
}
