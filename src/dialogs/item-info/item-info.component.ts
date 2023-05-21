import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateItemDialogComponent } from '../create-item/create-item-dialog.component';
import { ProductItem } from '../../models/product-item';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTabsModule } from '@angular/material/tabs';
import { IUser } from '../../interfaces/user';
import { PurchaseService } from 'src/services/purchase.service';
import { PurchaseOfGoodsComponent } from '../purchase-of-goods/purchase-of-goods.component';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatBadgeModule } from '@angular/material/badge';

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
    FormsModule,
    MatBadgeModule
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

  readonly subscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items: ProductItem[] = [];
  pagedItems = this.items.slice(0, 9);
  isExpanded!: string;
  rating: boolean[] = [true, true, false, false, false];
  authorId!: string | number;
  item!: ProductItem;
  user!: IUser;
  checkUser!: IUser;

  currentRating = 0;
  selectedTabIndex = 0;

  dialogProperty = 'expanded';

  comment = '';
  questionText = '';
  answerText = '';
  
  isCreateReviewMode = false;
  isCreateQuestionMode = false;
  isCreateAnswerMode = false;
  isAnswerReviewMode = false;

  answersCreate: { answerId: number }[] = [];

  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA)
    private data: { product: ProductItem; selectedTabIndex: number },
    private purchaseService: PurchaseService,
    private shoppingCartService: ShoppingCartService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkUser = this.purchaseService._currentUser;
    this.item = this.data.product;
    this.subscription.add(this.purchaseService.product.subscribe(
      (item) => {
        if (item) {
          this.changeDetector.detectChanges();
        }
        this.item = item;
      }
    ));
    this.selectedTabIndex = this.data.selectedTabIndex ?? 0;
    this.authorId = this.authenticationService.getAccountId();
    this.initMyGoods();
    this.subscription.add(this.purchaseService.user.subscribe(user => this.checkUser = user));
    this.item.questions.map(question => question.isCreateAnswerMode = false);
  }

  onAddItem() {
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

  get checkIsProductPurchased(): boolean  {
    let purchasedItem;
    if (this.checkUser) { 
      purchasedItem = this.checkUser.purchasedGoods.find(item => item.productId == this.item.productId);
    }
    return !!purchasedItem;
  }

  get matToolTipText(): string {
    let purchasedItem;
    if (this.checkUser) {
      purchasedItem = this.checkUser.purchasedGoods.find(item => item.productId == this.item.productId);
    }
    if (purchasedItem?.isReviewed) {
      return 'Ви вже ставили оцінку';
    } else if (!purchasedItem) {
      return 'Щоб залишити відгук потрібно купити товар';
    } else {
      return '';
    }
  }

  onBuyItem() {
    const ref = this.dialog.open(PurchaseOfGoodsComponent);
    ref.componentInstance.item = this.item;
    ref.afterClosed().subscribe(() => this.purchaseService._currentUser);
  }

  
  getQualityId(): boolean {
    const users: IUser[] = JSON.parse(localStorage.getItem('users') ?? '[]');
    const accountId = JSON.parse(localStorage.getItem('accountId') ?? '0');
    const user = users.find(user => user.id == accountId);
    
    const isAlreadyExist = user?.shoppingCart.find((item) => item.productId == this.item.productId);
    return this.item.author?.id == accountId || !!isAlreadyExist;
  }

  get isAuthorItem(): boolean {
    return this.item.author.id == JSON.parse(localStorage.getItem('accountId') ?? '0');
  }

  get onUserAuth(): boolean {
    return !!this.authenticationService.getAccountId();
  }

  onAddToShoppingCard() {
    this.shoppingCartService.addToCart(this.item);
  }

  onSendComment() {
    this.purchaseService.reviewItem(this.item, this.comment, this.currentRating);
    this.comment = '';
    this.isCreateReviewMode = false;
  }

  onChangeRating(rating: number) {
    this.currentRating = rating;
  }

  onSetRating(rating: number) {
    this.currentRating = rating;
  }

  get userAlreadyReviewed(): boolean {
    const flag = this.item.comments.find((user) => user.author.id == this.checkUser.id);
    return !!flag;
  }

  onCreateQuestion() {
    this.isCreateQuestionMode = false;
    this.purchaseService.askQuestion(this.item, this.questionText);
    this.questionText = '';
  }

  onCreateAnswerForQuestion(questionId: number, questionIndex: number, text: string) {
    this.isCreateAnswerMode = false;
    this.purchaseService.askAnswer(this.item, questionId, text);
    this.item.questions[questionIndex].tempQuestionText = '';
    this.item.questions[questionIndex].isCreateAnswerMode = false;
  }

  toggleCreateAnswerMode(questionIndex: number) {
    this.item.questions[questionIndex].isCreateAnswerMode = !this.item.questions[questionIndex].isCreateAnswerMode;
    // this.isCreateAnswerMode = !this.isCreateAnswerMode;
    this.answerText = '';
  }

  toggleCreateQuestionMode() {
    this.isCreateQuestionMode = !this.isCreateQuestionMode;
    this.questionText = '';
  }
}
