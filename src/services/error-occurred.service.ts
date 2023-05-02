import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogComponent } from "../dialogs/error-dialog/error-dialog.component";

@Injectable({ providedIn: 'root' })
export class ErrorOccurredService {
  constructor(private dialog: MatDialog) {}

  openErrorDialog(errorMessage: any) {
    const dialogRef = this.dialog.open(ErrorDialogComponent);
    dialogRef.componentInstance.errorMessage = errorMessage;
  }
}
