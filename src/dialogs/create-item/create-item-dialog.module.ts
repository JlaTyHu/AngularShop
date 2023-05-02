import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";

import { CreateItemDialogComponent } from "./create-item-dialog.component";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateItemDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ],
  exports: [CreateItemDialogComponent]
})
export class CreateItemDialogModule { }
