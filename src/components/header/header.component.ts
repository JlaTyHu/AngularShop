import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
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
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
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
    this.subscription.add(this.authenticationService.account.subscribe(
      (id) => {
        console.log('@@ flag ', id);
        console.log('@@ flag ', !!id);
        if (id == 0) {
          id = false;
        }
        if (id) {
          this.isAuthorized = true;
          this.items = this.shoppingCartService.currentShoppingCart;
          console.log('@@ items s ', this.shoppingCartService.currentShoppingCart)
        } else {
          this.isAuthorized = false;
          this.items = [];
        }
      }
    ));
    // this.isAuthorized = this.authenticationService.getAuthStatus();
    this.subscription.add(this.shoppingCartService.userShoppingCart.subscribe(
      (items) => {
        this.items = items;
        console.log('@@items shopping cart ', items)
      }
    ));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // dragEnd(event: CdkDragEnd, itemId: number) {
  //   const { x, y } = event.distance;
  //   if (Math.abs(x) > 100 || Math.abs(y) > 125) {
  //     this.items.splice(this.items.indexOf(event.source.data), 1);
  //     this.onDeleteForShoppingCard(itemId);
  //   }
  // }

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
            title: 'Реєстрація',
            formType: AuthenticationEnum.Registration,
          },
          maxWidth: '500px',
        });
        break;
      case AuthenticationEnum.Authorization:
        dialogRef = this.dialog.open(AuthenticationDialogComponent, {
          data: {
            title: 'Авторизація',
            formType: AuthenticationEnum.Authorization,
          },
          maxWidth: '500px',
        });
        break;
    }
  }

  onDeleteForShoppingCard(productId: number) {
    this.shoppingCartService.removeFromCart(productId);
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
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  navigateToUserProfile() {
    this.router.navigate(['/user-profile', JSON.parse(localStorage.getItem('accountId')?? '0')]);
  }

  get userAuthenticated(): boolean { 
    console.log('@@ metod')
    return this.authenticationService.getAuthStatus();
  }
}
