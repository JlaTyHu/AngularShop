import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { Store } from '@ngrx/store';
import { State } from '../../store/app-state';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemInfoComponent } from '../../dialogs/item-info/item-info.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { PurchaseOfGoodsComponent } from '../../dialogs/purchase-of-goods/purchase-of-goods.component';

@Component({
  selector: 'app-all-goods',
  templateUrl: './all-goods.component.html',
  styleUrls: ['./all-goods.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
  ]
})
export class AllGoodsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  accountId: any = 0;
  items: ProductItem[] = [];
  pagedItems: ProductItem[] = [];
  isExpanded!: string;
  rating: boolean[] = [true, true, false, false, false];
  stars = [1, 2, 3, 4, 5];
  subscription: Subscription = new Subscription();
  currentRating: number[] = [];

  constructor(
    private store: Store<State>,
    private createItemService: CreateItemService,
    private authenticationService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit() {
    this.items = this.createItemService.getItems();
    this.pagedItems = this.items.slice(0, 9);
    this.subscription.add(this.authenticationService.account.subscribe((id: any) => {
      if (id) {
        this.accountId = id;
      } else {
        this.accountId = 0;
      }
    }));
    this.accountId = this.authenticationService.getAccountId();

    this._fillCurrentRating();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _fillCurrentRating() {
    this.currentRating = [];
    this.items.map(item => this.currentRating.push(item.rating?.number?? 0))
  }

  onChangeRating(dig: number, index: number) {
    this.currentRating[index] = dig;
  }

  initializeItems() {
    this.onPageChange({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.items.length
    });
    console.log('@@ array1 ', this.items)
    console.log('@@ array2 ', this.paginator)
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    this.pagedItems = this.items.slice(startIndex, startIndex + event.pageSize);
  }

  onOpenItem(item: ProductItem, index?: number) {
    if (index) {
      this.dialogRef.open(ItemInfoComponent, { data: { product: item, selectedTabIndex: index }, width: 'fit-content' });
    } else {
      this.dialogRef.open(ItemInfoComponent, { data: { product: item }, width: 'fit-content' });
    }
  }

  getRating(item: ProductItem): number {
    return item?.rating?.number ?? 0;
  }

  onShowRating(event: Event, item: ProductItem, index: number) {
    event.stopPropagation();
    this.onOpenItem(item, index);
  }

  onBuyItem(event: Event, item: ProductItem) {
    event.stopPropagation();
    const ref = this.dialogRef.open(PurchaseOfGoodsComponent);
    ref.componentInstance.item = item;
  }

  getQualityId(product: ProductItem): boolean {
    const shoppingCard: ProductItem[] = JSON.parse(localStorage.getItem('shoppingCart')?? '[]');
    const isAlreadyExist = shoppingCard.find(item => item.productId == product.productId);
    return product.author?.id == this.accountId || !!isAlreadyExist;
  }

  onAddToShoppingCard(item: ProductItem) {
    this.shoppingCartService.addToCart(item);
  }

  get onUserAuth(): boolean {
    return !!this.authenticationService.getAccountId();
  }

  onMouseOver(index: number) {
    this._fillCurrentRating();
  }
}
