import { Component, Inject, OnInit } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductItem } from '../../models/product-item';
import { PurchaseService } from 'src/services/purchase.service';

@Component({
  selector: 'app-goods',
  templateUrl: './purchase-of-goods.component.html',
  styleUrls: ['./purchase-of-goods.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
  ]
})
export class PurchaseOfGoodsComponent implements OnInit {
  item: ProductItem = new ProductItem();
  cardNumber = '';
  cardDate = '';
  cardCVV2!: number;
  userInfo: { name: string, surname: string, address: string } = { name: '', surname: '', address: '' };
  isSubmitted = false;
  amount = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { product: ProductItem, selectedTabIndex: number },
    private purchaseService: PurchaseService
  ) { }

  ngOnInit() {
  }

  onSubmitForm() {
    this.purchaseService.buyGood(this.item);
    this.isSubmitted = true;
  }

  get chickRequiredFields() {
    return !!this.cardNumber
      && !!this.cardDate
      && !!this.cardCVV2
      && !!this.userInfo.name
      && !!this.userInfo.surname
      && !!this.userInfo.address
      && !!this.amount
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let { value } = input;
    value = value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    input.value = value;
  }

  onInputCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let { value } = input;
    this.cardNumber = value;
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let { value } = input;
    if (value.toString()[0] == '0') {
      value = '1' + value.toString().slice(1);
    }
    if (value.length > 2) {
      value = value.slice(0, 2);
    }
    input.value = value;
    this.amount = +input.value;
  }
}
