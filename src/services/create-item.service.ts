
import { Injectable } from '@angular/core';
import { ProductItem } from '../models/product-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreateItemService {
  items: BehaviorSubject<ProductItem[]> = new BehaviorSubject<ProductItem[]>([]);

  getItems(): ProductItem[] {
    const itemsString = localStorage.getItem('items');
    const items = itemsString !== null ? JSON.parse(itemsString) : [];
    return items;
  }

  addItem(item: ProductItem): Promise<boolean> {
    const items = this.getItems();
    const maxId = items.reduce((max, item) => item.productId > max ? item.productId : max, 0);
    const newId = maxId + 1;
    const authorId = localStorage.getItem('account');
    const user = JSON.parse(localStorage.getItem('users')?? '[]').find((user: any) => user.id == authorId);
    const newItem: ProductItem = {
      ...item,
      productId: newId,
      author: {
        id: JSON.parse(authorId ?? ''),
        login: user.login
      },
      rating: {
        number: 0,
        userIdWhoVoted: []
      },
      comments: []
    };
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    this.items.next(items);
    return Promise.resolve(true);
  }

  removeItem(id: number): Promise<boolean> {
    let items = this.getItems();
    items = items.filter(item => item.productId !== id);
    if (!!items.length) {
      localStorage.setItem('items', JSON.stringify(items));
      this.items.next(items);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  editItem(item: ProductItem): Promise<boolean> {
    // this.items.next(items);
    return Promise.resolve(true);
  }
}
