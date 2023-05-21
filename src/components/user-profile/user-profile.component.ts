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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductItem } from '../../models/product-item';
import {
  CdkDragDrop, CdkDragEnd,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { PurchaseService } from 'src/services/purchase.service';
import { IUser } from 'src/interfaces/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  isAuthorized: boolean = false;
  subscription: Subscription = new Subscription();
  items: ProductItem[] = [];
  isHoveredProfile = false;
  users: IUser[] = [];
  userProfile!: IUser;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authenticationService.getAllUsers();
    
    this.subscription.add(this.authenticationService.users.subscribe(
      (users) => this.users = users
    ));

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

    this.subscription.add(this.route.params.subscribe(
      (params) => {
        const currentUser = this.users.find(user => user.id == params['id']);
        console.log(currentUser);
        console.log(params['id']);
        console.log(this.users);
        if (currentUser) {
          this.userProfile = currentUser;
        }
      }
    ));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onNavigate(routName: string) {
    this.router.navigate([routName]);
  }

  onClick(event: Event) {
    event.stopPropagation();
  }

  handleClick(event: MouseEvent, action: boolean) {
    if (action) {
      event.stopPropagation();
    }
  }
}
