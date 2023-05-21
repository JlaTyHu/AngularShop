import { Component } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent {
  errorMessage!: any;

  constructor() { }
}
