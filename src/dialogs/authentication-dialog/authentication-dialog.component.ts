import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthenticationEnum } from '../../enums/authentication.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  AuthorizationRequest,
  RegistrationRequest
} from '../../store/actions/authentication.actions';
import { State } from '../../store/app-state';
import { IUser } from 'src/interfaces/user';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication-dialog.component.html',
  styleUrls: ['./authentication-dialog.component.css']
})
export class AuthenticationDialogComponent implements OnInit {
  readonly maxInputLength: number = 50;
  authenticationForm!: FormGroup;
  formProperties: {
    title: string,
    formType: AuthenticationEnum
  } = {title: 'default', formType: AuthenticationEnum.Registration};

  constructor(
    private dialogRef: MatDialogRef<AuthenticationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private store: Store<State>
  ) {
  }

  ngOnInit() {
    this._initializationFormType();
    this.formProperties.title = this.data.title;
    this.formProperties.formType = this.data.formType;
    this.store.select((state) => state.authentication.authenticated)
      .subscribe(res => res === true ? this.dialogRef.close() : res);
  }

  private _initializationFormType() {
    if (this.data.formType as AuthenticationEnum === AuthenticationEnum.Registration) {
      this.authenticationForm = this.fb.group({
        login: [
          '',
          Validators.required
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
          ]
        ],
        password: [
          '',
          Validators.required
        ],
        repeatPassword: [
          '',
          Validators.required
        ]
        }, {
          validators: this._passwordMatchValidator
        }
      );
    } else if (this.data.formType as AuthenticationEnum === AuthenticationEnum.Authorization) {
      this.authenticationForm = this.fb.group({
        login: [
          '',
          Validators.required
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
          ]
        ],
        password: [
          '',
          Validators.required
        ]
      });
    }
  }

  private _passwordMatchValidator(fg: FormGroup) {
    const password = fg.get('password')?.value;
    const repeatPassword = fg.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  onRegisterUser() {
    const login: string = this.authenticationForm.get('login')?.value;
    const email: string = this.authenticationForm.get('email')?.value;
    const password: string = this.authenticationForm.get('password')?.value;

    this.store.dispatch(new RegistrationRequest(({ login, email, password }) as IUser));
  }

  onAuthorizeUser() {
    const login: string = this.authenticationForm.get('login')?.value;
    const email: string = this.authenticationForm.get('email')?.value;
    const password: string = this.authenticationForm.get('password')?.value;

    this.store.dispatch(new AuthorizationRequest(({ login, email, password }) as IUser));
  }
}
