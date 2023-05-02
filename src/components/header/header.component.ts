import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationDialogComponent } from '../../dialogs/authentication-dialog/authentication-dialog.component';
import { AuthenticationEnum } from '../../enums/authentication.enum';
import { AuthenticationService } from '../../services/authentication.service';
import { State } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { AuthenticationLogoutRequest } from '../../store/actions/authentication.actions';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductItem } from '../../models/product-item';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatSidenavModule,
    MatBadgeModule,
    MatRippleModule,
    MatProgressBarModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'AngularShop';
  isAuthorized: boolean = false;
  subscription: Subscription = new Subscription();
  items: ProductItem[] = [];

  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private store: Store<State>,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {
  }

  ngOnInit() {
    this.subscription.add(this.authenticationService.isAuthenticated.subscribe(flag => this.isAuthorized = flag));
    this.isAuthorized = this.authenticationService.getAuthStatus();
    this.items = this.shoppingCartService.getCart();
    this.subscription.add(this.shoppingCartService.shoppingCart.subscribe(items => this.items = items));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onNavigate(routName: string) {
    this.router.navigate([routName]);
  }

  onAuthenticationDialog(formType: AuthenticationEnum) {
    let dialogRef!: MatDialogRef<AuthenticationDialogComponent, any>;
    console.log('@@ hey ', formType)
    switch (formType) {
      case AuthenticationEnum.Registration:
        dialogRef = this.dialog.open(AuthenticationDialogComponent, {
          data: {
            title: 'Registration',
            formType: AuthenticationEnum.Registration
          },
          width: '50%'
        });
        break;
      case AuthenticationEnum.Authorization:
        dialogRef = this.dialog.open(AuthenticationDialogComponent, {
          data: {
            title: 'Authorization',
            formType: AuthenticationEnum.Authorization
          },
          width: '50%'
        });
        break;
    }
  }

  onDeleteForShoppingCard(itemId: number) {
    this.shoppingCartService.removeFromCart(itemId);
  }

  onLogout() {
    this.store.dispatch(new AuthenticationLogoutRequest());
  }
}
