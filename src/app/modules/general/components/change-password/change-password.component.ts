import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public isSubmitDisabled: boolean = true;
  public changePasswordForm = {
    oldPassword: [null, [Validators.required]],
    newPassword: [
      null,
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]|[_]).{8,}$'
        ),
      ],
    ],
  };
  public changePasswordFg: FormGroup = this.fb.group(this.changePasswordForm);
  public validateMessages = {
    oldPassword: [
      {
        type: 'required',
        message: 'Please provide old password!',
      },
    ],
    newPassword: [
      { type: 'required', message: 'Please provide new password!' },
      {
        type: 'pattern',
        message:
          'Password pattern should be minimum 8 characters, at least one letter, one number and one special character!',
      },
    ],
  };

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.validateForm();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private validateForm() {
    this.changePasswordFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (!this.changePasswordFg.pristine && this.changePasswordFg.valid) {
          this.isSubmitDisabled = false;
        } else {
          this.isSubmitDisabled = true;
        }
      });
  }

  submitForm() {
    this.dialogRef.close({
      oldPassword: this.changePasswordFg.get('oldPassword').value.trim(),
      newPassword: this.changePasswordFg.get('newPassword').value.trim(),
    });
  }
}
