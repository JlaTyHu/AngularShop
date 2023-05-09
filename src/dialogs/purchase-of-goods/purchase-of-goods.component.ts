import { Component, Inject, OnInit } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { Store } from '@ngrx/store';
import { State } from '../../store/app-state';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-all-goods',
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
  item!: ProductItem;
  cardNumber = '';
  cardDate = '';
  cardCVV2!: number;
  userInfo: { name: string, surname: string } = { name: '', surname: '' };
  isSubmitted = false;
  amount = 0;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private createItemService: CreateItemService,
    @Inject(MAT_DIALOG_DATA) private data: { product: ProductItem, selectedTabIndex: number }
  ) { }

  ngOnInit() {
  }

  onSubmitForm() {
    this.isSubmitted = true;
  }

  get chickRequiredFields() {
    return !!this.cardNumber
      && !!this.cardDate
      && !!this.cardCVV2
      && !!this.userInfo.name
      && !!this.userInfo.surname
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
    // value = value.replace(/\D/g, '');
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
