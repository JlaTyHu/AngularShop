import { Component, OnInit, Inject  } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemManagerService } from '../../services/item-manager.service';
import { ProductItem } from '../../models/product-item';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { imgNotFound } from '../../consts/img-not-found.const';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemManager } from 'src/enums/item-manage.enum';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css'],
  animations: [
    trigger('fadeIn', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate('300ms ease-in-out'))
    ]),
    trigger('drawAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('.5s', style({ opacity: 0 })),
      ]),
    ]),
    trigger('dialogExpand', [
      state('expanded', style({
        height: '500px',
        width: '550px'
      })),
      transition('void => expanded', [
        style({ height: '0', width: '0' }),
        animate('300ms ease-in')
      ]),
      transition('expanded => void', [
        animate('300ms ease-out', style({ height: '0', width: '0' }))
      ])
    ])
  ]
})
export class CreateItemDialogComponent implements OnInit {
  readonly maxInputLength: number = 50;
  productItem: ProductItem = new ProductItem();
  imageUrl: string = '';
  imageLoaded = false;
  properties: { name: string, type: string, isEditMode: boolean }[] = [];
  dialogProperty = 'expanded';
  modalType!: ItemManager;

  constructor(
    private itemManagerService: ItemManagerService,
    @Inject(MAT_DIALOG_DATA) private data: { dialogAction: ItemManager, item: ProductItem }
  ) { }

  ngOnInit() {
    this.modalType = this.data.dialogAction;

    if (this.modalType === ItemManager.EditItem) {
      this.productItem = this.data.item;
      this.imageUrl = this.data.item.imgSrc;
      this.properties = this.data.item.properties;
    }
  }

  isPropertyFiledNotEmpty(index: number): boolean {
    return !!(this.properties[index].name && this.properties[index].type);
  }

  progressBarColor(index: number): string {
    if (this.properties[index].name && this.properties[index].type) {
      return 'primary';
    } else {
      return 'warn';
    }
  }

  progressBarValue(index: number): number {
    if (this.properties[index].name && this.properties[index].type) {
      return 100;
    } else if (this.properties[index].name || this.properties[index].type) {
      return 50;
    } else {
      return 0;
    }
  }

  onAddPropertyField() {
    this.properties.push({ name: '', type: '', isEditMode: true });
  }

  onDeleteProperty(index: number) {
    this.properties.splice(index, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.properties, event.previousIndex, event.currentIndex);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageUrlChange(value: string) {
    this.productItem.imgSrc = value;
  }

  onCreateItem() {
    const fullModel = { ...this.productItem, properties: this.properties };
    this.itemManagerService.addItem(fullModel);
  }

  onEditItem() {
    const fullModel = { ...this.productItem, properties: this.properties };
    this.itemManagerService.editItem(fullModel)
  }

  get disableButton(): boolean {
    return !this.productItem.productName
      || !this.productItem.description
      || !this.productItem.price
      || !this.productItem.imgSrc
      || !this.properties.length
      || !this.propertiesValid;
  }

  onErrorImg() {
    this.productItem.imgSrc = imgNotFound;
  }

  dialogActionType() {
    switch (this.modalType) {
      case ItemManager.CreateItem: return this.onCreateItem();
      case ItemManager.EditItem: return this.onEditItem(); 
    }
  }

  get propertiesValid(): boolean {
    return this.properties.every(property => !property.isEditMode);
  }

  get dialogTitle(): string {
    switch (this.modalType) {
      case ItemManager.CreateItem: return 'Створення нового товару';
      case ItemManager.EditItem: return 'Редагування товару';
      default: return 'Товар';
    }
  }

  get dialogButton(): string { 
    switch (this.modalType) {
      case ItemManager.CreateItem: return 'Створити';
      case ItemManager.EditItem: return 'Зберегти';
      default: return 'Продовжити';
    }
  }
}
