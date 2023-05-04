import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { CreateItemDialogComponent } from '../../dialogs/create-item/create-item-dialog.component';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-all-goods',
  templateUrl: './my-goods.component.html',
  styleUrls: ['./my-goods.component.css'],
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
export class MyGoodsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items: ProductItem[] = [];
  pagedItems = this.items.slice(0, 9);
  isExpanded!: string;
  rating: boolean[] = [true, true, false, false, false];
  authorId!: string | number;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private createItemService: CreateItemService
  ) { }

  ngOnInit() {
    this.authorId = this.authenticationService.getAccountId();
    this.initMyGoods();
  }

  onAddItem() {
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

  onCreateItem() {
    const ref = this.dialog.open(CreateItemDialogComponent, {
      width: '30%'
    });
  }

  private initMyGoods() {
    this.items = JSON.parse(localStorage.getItem('items')?? '[]')
      .filter((item: ProductItem) => item.author?.id == this.authorId);
    this.pagedItems = this.items.slice(0, 9);
  }

  getRating(item: ProductItem): number {
    return item?.rating?.number ?? 0;
  }
}
