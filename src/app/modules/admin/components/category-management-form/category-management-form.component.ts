import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Category, CategoryEntryDto } from 'src/app/core/models/category.model';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-category-management-form',
  templateUrl: './category-management-form.component.html',
  styleUrls: ['./category-management-form.component.scss'],
})
export class CategoryManagementFormComponent implements OnInit {
  private userId = this.userService.getUserId();
  public category: Category = this.data.data;
  public isAdd: boolean = this.data.isAdd;
  public isEdit: boolean = this.data.isEdit;
  public isDelete: boolean = this.data.isDelete;
  public isSubmitDisabled: boolean = !this.isDelete;
  public inputCategoryForm = {
    name: [null, Validators.required],
  };
  public inputCategoryFg: FormGroup = this.fb.group(this.inputCategoryForm);
  public validateMessages = {
    name: [
      {
        type: 'required',
        message: 'Please provide category!',
      },
    ],
  };

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<CategoryManagementFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if(this.isEdit) this.initializeForm();
    this.validateForm();
  }

  public validateForm() {
    this.inputCategoryFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        const nameField = this.inputCategoryFg.get('name');
        const isValid = !nameField.pristine && nameField.valid;
        this.isSubmitDisabled = !isValid;
      });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  private initializeForm(){
    this.inputCategoryFg.get('name').setValue(this.category.name);
  }

  public submitForm() {
    let response;

    if(this.isAdd) {
      response = {
        name: this.inputCategoryFg.get('name').value.trim(),
        createdBy: this.userId,
        modifiedBy: null
      };
    }else if(this.isEdit){
      response = {
        name: this.inputCategoryFg.get('name').value.trim(),
        createdBy: null,
        modifiedBy: this.userId
      };
    }else{
      //just pass anything for delete to confirm lol
      response = true;
    }

    this.dialogRef.close(response);
  }
}
