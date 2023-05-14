import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthenticationDialogComponent } from '../../dialogs/authentication-dialog/authentication-dialog.component';
import { AuthenticationEnum } from '../../enums/authentication.enum';
import { AuthenticationService } from '../../services/authentication.service';
import { State } from '../../store/app-state';
import { Store } from '@ngrx/store';
import { AuthenticationLogoutRequest } from '../../store/actions/authentication.actions';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductItem } from '../../models/product-item';
import {
  CdkDragDrop, CdkDragEnd,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  title = 'AngularShop';
  isAuthorized: boolean = false;
  subscription: Subscription = new Subscription();
  items: ProductItem[] = [];
  isHoveredProfile = false;

  constructor(
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private store: Store<State>,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.subscription.add(this.authenticationService.isAuthenticated.subscribe(
      (flag) => (this.isAuthorized = flag)
    ));
    this.isAuthorized = this.authenticationService.getAuthStatus();
    this.subscription.add(this.shoppingCartService.userShoppingCart.subscribe(
      (items) => this.items = items
    ));
    this.subscription.add(this.shoppingCartService.userShoppingCart.subscribe(
      (items) => (this.items = items)
    ));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dragEnd(event: CdkDragEnd, itemId: number) {
    const { x, y } = event.distance;
    if (Math.abs(x) > 100 || Math.abs(y) > 125) {
      this.items.splice(this.items.indexOf(event.source.data), 1);
      this.onDeleteForShoppingCard(itemId);
    }
  }

  onNavigate(routName: string) {
    this.router.navigate([routName]);
  }

  onClick(event: Event) {
    event.stopPropagation();
  }

  onAuthenticationDialog(formType: AuthenticationEnum) {
    let dialogRef!: MatDialogRef<AuthenticationDialogComponent, any>;
    console.log('@@ hey ', formType);
    switch (formType) {
      case AuthenticationEnum.Registration:
        dialogRef = this.dialog.open(AuthenticationDialogComponent, {
          data: {
            title: 'Registration',
            formType: AuthenticationEnum.Registration,
          },
          width: '50%',
        });
        break;
      case AuthenticationEnum.Authorization:
        dialogRef = this.dialog.open(AuthenticationDialogComponent, {
          data: {
            title: 'Authorization',
            formType: AuthenticationEnum.Authorization,
          },
          width: '50%',
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

  handleClick(event: MouseEvent, action: boolean) {
    if (action) {
      event.stopPropagation();
    }
  }

  drop(event: CdkDragDrop<ProductItem[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
