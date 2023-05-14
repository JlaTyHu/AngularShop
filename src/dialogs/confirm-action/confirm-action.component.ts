import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.css'],
})
export class ConfirmActionComponent {
  confirmText!: any;

  constructor(private dialogRef: MatDialogRef<ConfirmActionComponent>) { }

  onDeleteItem() {
    this.dialogRef.close(true);
  }
}
