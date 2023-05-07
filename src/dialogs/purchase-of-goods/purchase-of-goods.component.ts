import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';

import { Store } from '@ngrx/store';
import { State } from '../../store/app-state';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateItemService } from '../../services/create-item.service';
import { ProductItem } from '../../models/product-item';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-all-goods',
  templateUrl: './purchase-of-goods.component.html',
  styleUrls: ['./purchase-of-goods.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
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
export class PurchaseOfGoodsComponent implements OnInit {
  cardNumber = '';
  cardDate: Date = new Date();
  cardCVV2!: number;
  userInfo: { name: string, surname: string } = { name: '', surname: '' };
  isSubmitted = false;
  date!: Date;

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
  }

  chosenYearHandler(normalizedYear: Date) {
    const ctrlValue = this.date;
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.date = ctrlValue;
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date;
    ctrlValue.setMonth(normalizedMonth.getMonth());
    this.date = ctrlValue;
    datepicker.close();
  }
}
