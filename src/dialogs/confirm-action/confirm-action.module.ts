import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ConfirmActionComponent } from "./confirm-action.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [ConfirmActionComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule
  ],
  exports: [ConfirmActionComponent]
})
export class ConfirmActionModule { }
