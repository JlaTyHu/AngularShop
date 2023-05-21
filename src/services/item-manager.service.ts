
import { Injectable } from '@angular/core';
import { ProductItem } from '../models/product-item';
import { ReplaySubject } from 'rxjs';
import { IUser } from 'src/interfaces/user';

@Injectable({ providedIn: 'root' })
export class ItemManagerService {
  items: ReplaySubject<ProductItem[]> = new ReplaySubject<ProductItem[]>(1);

  getAllItems(): ProductItem[] {
    const itemsJSON = localStorage.getItem('items');
    const items = itemsJSON !== null ? JSON.parse(itemsJSON) : [];
    return items;
  }

  getUserItems(): ProductItem[] { 
    let items = JSON.parse(localStorage.getItem('items')?? '[]');
    const accountId = JSON.parse(localStorage.getItem('accountId') ?? '0');
    items = items.filter((item: ProductItem) => item.author.id == accountId);
    return items;
  }

  addItem(item: ProductItem): Promise<boolean> {
    const items: ProductItem[] = this.getAllItems();
    const maxId: number = items.reduce((max, item) => item.productId > max ? item.productId : max, 0);
    const newId: number = maxId + 1;
    const accountId = JSON.parse(localStorage.getItem('accountId')?? '0');
    const users: IUser[] = JSON.parse(localStorage.getItem('users') ?? '[]') as IUser[];
    let user = users.find(user => user.id == accountId);
    if (!user) {
      const defaultUser: IUser = {
        id: 0,
        login: '',
        email: '',
        password: '',
        shoppingCart: [],
        purchasedGoods: []
      }
      user = defaultUser;
    }

    const newItem: ProductItem = {
      ...item,
      productId: newId,
      author: {
        id: JSON.parse(accountId ?? '0'),
        login: user.login?? '0'
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
    let items = this.getAllItems();
    items = items.filter(item => item.productId != id);
    if (!!items.length) {
      localStorage.setItem('items', JSON.stringify(items));
      this.items.next(items);
      return Promise.resolve(true);
    } else {
      localStorage.setItem('items', JSON.stringify(items));
      return Promise.resolve(false);
    }
  }

  editItem(productItem: ProductItem): Promise<boolean> {
    // this.items.next(items);
    let userItems = this.getAllItems();
    userItems = userItems.filter(item => item.productId != productItem.productId);
    userItems.push(productItem);
    localStorage.setItem('items', JSON.stringify(userItems));
    this.items.next(userItems);
    return Promise.resolve(true);
  }
}
