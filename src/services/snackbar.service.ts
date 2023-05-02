import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  showMessage(message: string) {
    this.snackbar.open(message, 'X', { duration: 3000 });
  }
}
