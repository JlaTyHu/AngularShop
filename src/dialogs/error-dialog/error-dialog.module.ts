import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ErrorDialogComponent } from "./error-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [ErrorDialogComponent]
})
export class ErrorDialogModule { }
