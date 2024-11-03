import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-management-form',
  templateUrl: './user-management-form.component.html',
  styleUrls: ['./user-management-form.component.scss'],
})
export class UserManagementFormComponent implements OnInit {
  public isAdd: boolean = this.data.isAdd;
  public isEdit: boolean = this.data.isEdit;
  public userId: string;
  public isSubmitDisabled: boolean = true;
  public userTypeList: string[] = ['user', 'admin'];
  public updateProfileForm = {
    id: [''],
    email: [''],
    password: [''],
    name: [null, [Validators.required]],
    type: ['user'],
    position: [null, [Validators.required]],
    department: [null, [Validators.required]],
    contact: [''],
    address: [''],
  };
  public updateProfileFg: FormGroup = this.fb.group(this.updateProfileForm);
  public validateMessages = {
    id: [{
      type: 'required', message: 'Please provide user ID!',
    }],
    email: [
      { type: 'email', message: 'Please provide email with valid format!' },
      { type: 'required', message: 'Please provide email!' },
    ],
    password: [
      { type: 'required', message: 'Please provide new password!' },
      {
        type: 'pattern',
        message:
          'Password pattern should be minimum 8 characters, at least one letter, one number and one special character!',
      },
    ],
    name: [
      {
        type: 'required',
        message: 'Please provide full name!',
      },
    ],
    position: [{ type: 'required', message: 'Please provide position!' }],
    department: [{ type: 'required', message: 'Please provide department!' }],
  };

  constructor(
    private dialogRef: MatDialogRef<UserManagementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.isEdit) this.initializeData();
    if (this.isAdd) this.initializeField();
    this.validateForm();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private validateForm() {
    this.updateProfileFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (!this.updateProfileFg.pristine && this.updateProfileFg.valid) {
          this.isSubmitDisabled = false;
        } else {
          this.isSubmitDisabled = true;
        }
      });
  }

  private initializeField() {
    const inputFg = this.updateProfileFg;

    inputFg.get('id').addValidators([Validators.required]);
    inputFg.get('id').setValue(null);
    inputFg.get('id').updateValueAndValidity();

    inputFg.get('email').addValidators([Validators.required, Validators.email]);
    inputFg.get('email').setValue(null);
    inputFg.get('email').updateValueAndValidity();

    inputFg
      .get('password')
      .addValidators([
        Validators.required,
        Validators.pattern('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]|[_]).{8,}$'),
      ]);
    inputFg.get('password').setValue(null);
    inputFg.get('password').updateValueAndValidity();
  }

  private initializeData() {
    const user = this.data.user;
    const inputFg = this.updateProfileFg;
    this.userId = user.id;

    inputFg.get('name').setValue(user.name);
    inputFg.get('type').setValue(user.type);
    inputFg.get('position').setValue(user.position);
    inputFg.get('department').setValue(user.department);
    inputFg.get('contact').setValue(user.contact);
    inputFg.get('address').setValue(user.address);
  }

  public selectType(userType: string) {
    this.updateProfileFg.get('type').setValue(userType);
    this.updateProfileFg.get('type').markAsTouched();
    this.updateProfileFg.get('type').markAsDirty();
  }

  submitForm() {
    const formGroup = this.updateProfileFg;
    let contact: string | null;
    let address: string | null;

    if (formGroup.get('contact').value == null) {
      contact = null;
    } else {
      contact = formGroup.get('contact').value.toString().trim();
    }
    if (formGroup.get('address').value == null) {
      contact = null;
    } else {
      address = formGroup.get('address').value.trim();
    }

    if(this.isEdit){
      this.dialogRef.close({
        name: formGroup.get('name').value.trim(),
        type: formGroup.get('type').value,
        position: formGroup.get('position').value.trim(),
        department: formGroup.get('department').value.trim(),
        contact: contact,
        address: address,
      });
    }else{
      this.dialogRef.close({
        id: formGroup.get('id').value.trim().toUpperCase(),
        email: formGroup.get('email').value.trim(),
        password: formGroup.get('password').value.trim(),
        name: formGroup.get('name').value.trim(),
        type: formGroup.get('type').value,
        position: formGroup.get('position').value.trim(),
        department: formGroup.get('department').value.trim(),
        contact: contact,
        address: address,
      });
    }
    
  }
}
