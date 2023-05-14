import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "../../store/app-state";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularShop';

  loading$ = this.store.select((state) => state.authentication.loading);

  constructor(private store: Store<State>) { }
}
