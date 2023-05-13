import { NgModule } from '@angular/core';
import { CardNumberPipe } from '../../pipes/card-number.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PurchaseOfGoodsComponent } from './purchase-of-goods.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [PurchaseOfGoodsComponent, CardNumberPipe],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    DragDropModule
  ],
  exports: [PurchaseOfGoodsComponent],
})
export class PurchaseOfGoodsModule {}
