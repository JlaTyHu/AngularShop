import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";

import { AuthenticationDialogComponent } from "./authentication-dialog.component";

@NgModule({
  declarations: [AuthenticationDialogComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [AuthenticationDialogComponent]
})
export class AuthenticationDialogModule { }
