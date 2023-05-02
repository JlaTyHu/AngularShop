import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../store/app-state';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { imgNotFound } from '../../consts/img-not-found.const';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css'],
  animations: [
    trigger('fadeIn', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate('300ms ease-in-out'))
    ])
  ]
})
export class CreateItemDialogComponent implements OnInit {
  readonly maxInputLength: number = 50;
  productItem: ProductItem = new ProductItem();
  imageUrl: string = '';
  imageLoaded = false;

  constructor(
    private dialogRef: MatDialogRef<CreateItemDialogComponent>,
    private fb: FormBuilder,
    private createItemService: CreateItemService,
    private store: Store<State>
  ) {
  }

  ngOnInit() {

  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageUrlChange(value: string) {
    this.productItem.imgSrc = value;
  }

  onCreateItem() {
    this.createItemService.addItem(this.productItem);
  }

  disableButton(): boolean {
    return !this.productItem.productName
      || !this.productItem.description
      || !this.productItem.price
      || !this.productItem.imgSrc;
  }

  onErrorImg() {
    console.log('@@ default img was set')
    this.productItem.imgSrc = imgNotFound;
  }
}
