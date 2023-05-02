import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductItem } from '../models/product-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  shoppingCart: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this.loadCart();
  }

  addToCart(product: ProductItem) {
    const itemList: ProductItem[] = JSON.parse(localStorage.getItem('shoppingCart')?? '[]');
    itemList.push(product);
    this.saveCart(itemList);
  }

  removeFromCart(index: number) {
    const itemList: ProductItem[] = JSON.parse(localStorage.getItem('shoppingCart')?? '[]');
    const newItemList = itemList.filter(item => item.productId != index);
    this.saveCart(newItemList);
  }

  getCart() {
    return JSON.parse(localStorage.getItem('shoppingCart')?? '[]');
  }

  saveCart(item: ProductItem[]) {
    localStorage.setItem('shoppingCart', JSON.stringify(item));
    this.shoppingCart.next(this.getCart());
  }

  loadCart() {
    if (localStorage.getItem('shoppingCart')) {
      this.shoppingCart.next(JSON.parse(localStorage.getItem('shoppingCart')?? '[]'));
    }
  }
}
