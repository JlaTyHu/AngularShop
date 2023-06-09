import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { AuthenticationDialogModule } from '../../dialogs/authentication-dialog/authentication-dialog.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppRoutingModule } from './app-routing.module'

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from '../../store/app-state';
import { AuthenticationEffects } from '../../store/effects/authentication.effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '../../interceptors/authentication.interceptor';
import { ErrorDialogModule } from '../../dialogs/error-dialog/error-dialog.module';
import { FooterComponent } from '../footer/footer.component';
import { AuthenticationMessagesEffects } from '../../store/effects/authentication-messages.effects';
import { CreateItemDialogModule } from '../../dialogs/create-item/create-item-dialog.module';
import { PurchaseOfGoodsModule } from '../../dialogs/purchase-of-goods/purchase-of-goods.module';
import { HeaderModule } from '../header/header.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { ConfirmActionModule } from 'src/dialogs/confirm-action/confirm-action.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HeaderModule,
    FooterComponent,
    UserProfileModule,
    AuthenticationDialogModule,
    ErrorDialogModule,
    CreateItemDialogModule,
    PurchaseOfGoodsModule,
    ConfirmActionModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 999
    }),
    EffectsModule.forRoot([
      AuthenticationEffects,
      AuthenticationMessagesEffects
    ]),
    MatProgressBarModule,
    RouterOutlet,
    AppRoutingModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
