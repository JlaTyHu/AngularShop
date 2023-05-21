import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

import { ItemManagerService } from '../../services/item-manager.service';
import { ProductItem } from '../../models/product-item';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemInfoComponent } from '../../dialogs/item-info/item-info.component';
import { PurchaseOfGoodsComponent } from '../../dialogs/purchase-of-goods/purchase-of-goods.component';
import { FormsModule } from '@angular/forms';
import { PageType } from 'src/enums/page.enum';
import { ActivatedRoute } from '@angular/router';
import { CreateItemDialogComponent } from 'src/dialogs/create-item/create-item-dialog.component';
import { ConfirmActionComponent } from 'src/dialogs/confirm-action/confirm-action.component';
import { SnackbarService } from 'src/services/snackbar.service';
import { ItemMessages } from 'src/enums/item-messages.enum';
import { IUser } from 'src/interfaces/user';
import { imgNotFound } from 'src/consts/img-not-found.const';
import { ItemManager } from 'src/enums/item-manage.enum';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css'],
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
    MatCheckboxModule,
    FormsModule
  ],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(300)),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoodsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  accountId: any = 0;
  items: ProductItem[] = [];
  pagedItems: ProductItem[] = [];
  isExpanded!: string;
  rating: boolean[] = [true, true, false, false, false];
  stars = [1, 2, 3, 4, 5];
  subscription: Subscription = new Subscription();
  currentRating: number[] = [];
  textFilter = '';
  priceFilter = { from: 0, to: 0 };
  pageType!: PageType;
  PageType = PageType;
  private intervalId: any;

  constructor(
    private itemManagerService: ItemManagerService,
    private authenticationService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._getItemsForPageType();
    this.subscription.add(
      this.authenticationService.account.subscribe((id: any) => {
        if (id) {
          this.accountId = id;
          this._getItemsForPageType();
        } else {
          this.accountId = 0;
        }

        this.changeDetectorRef.detectChanges();

        this.itemManagerService.items.subscribe(() => {
          this._getItemsForPageType();
          this.changeDetectorRef.detectChanges();
        });
      })
    );
    this.accountId = this.authenticationService.getAccountId();
  
    this._fillCurrentRating();

    this.intervalId = setInterval(() => this._fillCurrentRating(), 1000);
  }

  private _getItemsForPageType() {
    this.pageType = this.route.snapshot.data['pageType'] as PageType;
    if (this.pageType === PageType.AllGoodsComponent) {
      this.items = this.itemManagerService.getAllItems();
    } else if (this.pageType === PageType.MyGoodsComponent) {
      this.items = this.itemManagerService.getUserItems();
    }
    this.pagedItems = this.items.slice(0, 9);
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private _fillCurrentRating() {
    this.currentRating = [];
    this.items.map((item) => this.currentRating.push(item.rating?.number ?? 0));
    this.changeDetectorRef.detectChanges();
  }

  onEditUserItem(item: ProductItem) {
    this.dialog.open(CreateItemDialogComponent, {
      width: 'fit-content',
      data: {
        dialogAction: ItemManager.EditItem,
        item: item
      }
    });
  }

  onDeleteUserItem(item: ProductItem) { 
    const ref = this.dialog.open(ConfirmActionComponent);
    ref.componentInstance.confirmText = `Ви впевнені що хочете видалити назавжди товар <strong>"${item.productName}"</strong>?`;
    ref.afterClosed().subscribe(
      (action) => {
        if (action) {
          this.itemManagerService.removeItem(item.productId).then(() => this.snackbarService.showMessage(ItemMessages.DeleteItemSuccess));
          this._getItemsForPageType();
        }
      }
    );
  }

  onChangeRating(dig: number, index: number) {
    this.currentRating[index] = dig;
  }

  initializeItems() {
    this.onPageChange({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.items.length,
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    this.pagedItems = this.items.slice(startIndex, startIndex + event.pageSize);
  }

  onOpenItem(item: ProductItem, index?: number) {
    if (index) {
      this.dialog.open(ItemInfoComponent, {
        data: { product: item, selectedTabIndex: index },
        width: 'fit-content',
      });
    } else {
      this.dialog.open(ItemInfoComponent, {
        data: { product: item },
        width: 'fit-content',
      });
    }
  }

  itemFilter() {
    if (this.pageType === PageType.AllGoodsComponent) {
      this.items = this.itemManagerService.getAllItems();
    } else if (this.pageType === PageType.MyGoodsComponent) {
      this.items = this.itemManagerService.getUserItems();
    }

    if (this.textFilter) {
      this.items = this.items.filter(
        (item) =>
          item.productName
            .toLowerCase()
            .includes(this.textFilter.toLowerCase()) ||
          item.description.toLowerCase().includes(this.textFilter.toLowerCase())
      );
    }

    if (this.priceFilter.from && !this.priceFilter.to) {
      this.items = this.items.filter(
        (item) => item.price >= this.priceFilter.from
      );
    } else if (!this.priceFilter.from && this.priceFilter.to) {
      this.items = this.items.filter(
        (item) => item.price <= this.priceFilter.to
      );
    } else if (this.priceFilter.from && this.priceFilter.to) {
      this.items = this.items.filter(
        (item) =>
          item.price >= this.priceFilter.from &&
          item.price <= this.priceFilter.to
      );
    }

    this.pagedItems = this.items.slice(0, 9);
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
    const ref = this.dialog.open(PurchaseOfGoodsComponent);
    ref.componentInstance.item = item;
  }

  getQualityId(product: ProductItem): boolean {
    const users: IUser[] = JSON.parse(localStorage.getItem('users') ?? '[]');
    const accountId = JSON.parse(localStorage.getItem('accountId') ?? '0');
    const user = users.find(user => user.id == accountId);
    
    const isAlreadyExist = user?.shoppingCart.find((item) => item.productId == product.productId);
    return product.author?.id == this.accountId || !!isAlreadyExist;
  }

  onAddToShoppingCard(event: Event, item: ProductItem) {
    event.stopPropagation();
    this.shoppingCartService.addToCart(item);
  }

  get onUserAuth(): boolean {
    return !!this.authenticationService.getAccountId();
  }

  onMouseOver(index: number) {
    this._fillCurrentRating();
  }

  onCreateItem() {
    this.dialog.open(CreateItemDialogComponent, {
      width: 'fit-content',
      data: {
        dialogAction: ItemManager.CreateItem,
      }
    });
  }

  itemMatTooltip(product: ProductItem): string {
    if (this.onUserAuth && !this.getQualityId(product)) {
      return 'У кошик';
    } else if (this.getQualityId(product)) {
      return 'Вже в кошику'
    } else {
      return 'Авторизуйтесь, щоб додати до кошика';
    }
  }

  onErrorImg(index: number) {
    this.items[index].imgSrc = imgNotFound;
  }
}
