import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { Store } from '@ngrx/store';
import { State } from '../../store/app-state';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateItemDialogComponent } from '../create-item/create-item-dialog.component';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTabsModule } from '@angular/material/tabs';
import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-goods',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    DragDropModule,
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
    trigger('dialogExpand', [
      state('expanded', style({
        height: 'fit-content',
        width: 'fit-content'
      })),
      transition('void => expanded', [
        style({ height: '0', width: '0' }),
        animate('300ms ease-in')
      ]),
      transition('expanded => void', [
        animate('300ms ease-out', style({ height: '0', width: '0' }))
      ])
    ])
  ],
})
export class ItemInfoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items: ProductItem[] = [];
  pagedItems = this.items.slice(0, 9);
  isExpanded!: string;
  rating: boolean[] = [true, true, false, false, false];
  authorId!: string | number;
  item!: ProductItem;
  user!: IUser;
  selectedTabIndex = 0;
  dialogProperty = 'expanded';

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private createItemService: CreateItemService,
    @Inject(MAT_DIALOG_DATA)
    private data: { product: ProductItem; selectedTabIndex: number }
  ) {}

  ngOnInit() {
    this.item = this.data.product;
    this.selectedTabIndex = this.data.selectedTabIndex ?? 0;
    console.log('@@ item ', this.item);
    this.authorId = this.authenticationService.getAccountId();
    this.initMyGoods();
  }

  onAddItem() {
    this.onPageChange({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.items.length,
    });
    console.log('@@ array1 ', this.items);
    console.log('@@ array2 ', this.paginator);
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    this.pagedItems = this.items.slice(startIndex, startIndex + event.pageSize);
  }

  onCreateItem() {
    const ref = this.dialog.open(CreateItemDialogComponent, {
      width: '30%',
    });
  }

  private initMyGoods() {
    this.items = JSON.parse(localStorage.getItem('items') ?? '[]').filter(
      (item: ProductItem) => item.author?.id == this.authorId
    );
    this.pagedItems = this.items.slice(0, 9);
  }

  getRating(item: ProductItem): number {
    return item?.rating?.number ?? 0;
  }
}
