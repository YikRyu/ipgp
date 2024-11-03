import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  public userData: User = this.data.data;
  public userId: string = this.data.userId;
  public isSubmitDisabled: boolean = true;
  public userTypeList: string[] = ['user', 'admin'];
  public updateProfileForm = {
    name: [this.userData.name, [Validators.required]],
    type: [this.userData.type],
    position: [this.userData.position, [Validators.required]],
    department: [this.userData.department, [Validators.required]],
    contact: [this.userData.contact],
    address: [this.userData.address],
  };
  public updateProfileFg: FormGroup = this.fb.group(this.updateProfileForm);
  public validateMessages = {
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
    private dialogRef: MatDialogRef<UpdateProfileComponent>,
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

  public selectType(userType: string) {
    this.updateProfileFg.get('type').setValue(userType);
  }

  submitForm() {
    const formGroup = this.updateProfileFg;
    let contact: string | null;
    let address: string | null;

    if (formGroup.get('contact').value == null){
      contact = null;
    } else{
      contact = formGroup.get('contact').value.toString().trim()
    }
    if (formGroup.get('address').value == null){
      contact = null
    }else{
      address = formGroup.get('address').value.trim();
    }

    this.dialogRef.close({
      data: {
        name: formGroup.get('name').value.trim(),
        type: formGroup.get('type').value,
        position: formGroup.get('position').value.trim(),
        department: formGroup.get('department').value.trim(),
        contact: contact,
        address: address,
      },
    });
  }
}
