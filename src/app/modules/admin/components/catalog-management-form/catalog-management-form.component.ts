import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reward, RewardEntryDto } from 'src/app/core/models/reward.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/services/user.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/http/category.service';

@Component({
  selector: 'app-catalog-management-form',
  templateUrl: './catalog-management-form.component.html',
  styleUrls: ['./catalog-management-form.component.scss'],
})
export class CatalogManagementFormComponent implements OnInit {
  public categories: Category[] = [];
  private userId = this.userService.getUserId();
  public isLimited: boolean = false;
  public imageUrl: any;
  public fileName: any;
  public reward: Reward = this.data.data;
  public isAdd: boolean = this.data.isAdd;
  public isEdit: boolean = this.data.isEdit;
  public isDelete: boolean = this.data.isDelete;
  public isSubmitDisabled: boolean = !this.isDelete;
  private now = new Date(new Date().toDateString());
  public inputRewardForm = {
    name: [null, Validators.required],
    category: [null, Validators.required],
    points: [0, Validators.required],
    quantity: [0, Validators.required],
    description: [null, Validators.required],
    limited: [false, Validators.required],
    limitedTime: [''],
    image: [null, Validators.required],
  };
  public inputRewardFg: FormGroup = this.fb.group(this.inputRewardForm);
  public validateMessages = {
    name: [
      {
        type: 'required',
        message: 'Please provide reward!',
      },
    ],
    description: [
      {
        type: 'required',
        message: 'Please provide reward description!',
      },
    ],
    points: [
      {
        type: 'required',
        message: 'Please provide reward points!',
      }
    ],
    quantity: [
      {
        type: 'required',
        message: 'Please provide reward quantity!',
      }
    ],
    limitedTime: [
      {
        type: 'required',
        message: 'Please select a time!',
      },
      {
        type: 'minTime',
        message: 'Please select date time that is greater than today!',
      },
    ],
    image: [
      {
        type: 'oversized',
        message: 'Please upload picture with maximum 2MB in size!',
      },
      {
        type: 'wrongFormat',
        message: 'Please only upload in PNG/JPS format!',
      },
    ],
  };

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CatalogManagementFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.isEdit) this.initializeForm();
    if (this.isAdd) this.inputRewardFg.get('limitedTime').setValue(null);
    this.getCategories();
    this.validateForm();
  }

  public validateForm() {
    this.inputRewardFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.disableSubmit();
      });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  private initializeForm() {
    const formGroup = this.inputRewardFg;

    formGroup.get('name').setValue(this.reward.name);
    formGroup.get('description').setValue(this.reward.description);
    formGroup.get('category').setValue(this.reward.category);
    formGroup.get('points').setValue(this.reward.points);
    formGroup.get('quantity').setValue(this.reward.quantity);
    formGroup.get('limited').setValue(this.reward.limited);
    if (this.reward.limited) {
      this.isLimited = true;
      formGroup.get('limitedTime').setValue(this.reward.limitedTime.toString().slice(0,16));
    }else{
      formGroup.get('limitedTime').setValue(null);
    }
    formGroup.get('image').setValue(this.reward.image);
    this.imageUrl = this.reward.image;
  }

  private disableSubmit() {
    const formGroup = this.inputRewardFg;
    const name = formGroup.get('name');
    const description = formGroup.get('description');
    const category = formGroup.get('category');
    const points = formGroup.get('points');
    const quantity = formGroup.get('quantity');
    const limited = formGroup.get('limited');
    const limitedTime = formGroup.get('limitedTime');
    const image = formGroup.get('image');
    let isImageValid;
    let isLimitedValid;

    if (limited.value == true) {
      if (limitedTime.value != null) {
        const selectedTime = new Date(new Date(limitedTime.value).toDateString());
        if (selectedTime < this.now){
          this.inputRewardFg.get('limitedTime').setErrors({ minTime: true });
          isLimitedValid = false;
        }
        else {
          this.inputRewardFg.get('limitedTime').setErrors(null);
          isLimitedValid = true;
        } 
      } else {
        this.inputRewardFg.get('limitedTime').setErrors({ required: true });
        isLimitedValid = false;
      }
    } else {
      isLimitedValid = true;
    }

    if (!image.pristine) {
      isImageValid = image.valid;
    } else {
      isImageValid = true;
    }

    this.isSubmitDisabled = !(
      !formGroup.pristine &&
      name.valid &&
      description.valid &&
      category.valid &&
      points.valid &&
      isLimitedValid &&
      isImageValid
    );
  }

  public selectCategory(category: Category) {
    this.inputRewardFg.get('category').setValue({
      id: category.id,
      name: category.name,
    });
  }

  public setLimited(value: boolean) {
    this.isLimited = value;
    this.inputRewardFg.get('limited').setValue(value);
    this.inputRewardFg.get('limited').markAsDirty();
    if (value) {
      this.inputRewardFg.get('limitedTime').setValidators([Validators.required]);
      this.inputRewardFg.get('limitedTime').setErrors({ required: true });
    } else {
      this.inputRewardFg.get('limitedTime').setValue(null);
      this.inputRewardFg.get('limitedTime').markAsPristine();
      this.inputRewardFg.get('limitedTime').removeValidators([Validators.required]);
      this.inputRewardFg.get('limitedTime').setErrors(null);
      this.inputRewardFg.get('limitedTime').updateValueAndValidity();
    }
  }

  public uploadImage(event: any) {
    const file = event.target.files[0];
    const fileType = file.type;
    const fileSize = file.size / 1024 / 2014;
    this.fileName = file.name;
    this.inputRewardFg.get('image').markAsDirty();
    let base64String;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (fileEvent) => {
      base64String = fileEvent.target.result;

      if (
        !(
          fileType == 'image/jpeg' ||
          fileType == 'image/jpg' ||
          fileType == 'image/png'
        )
      ) {
        this.inputRewardFg.get('image').setErrors({ wrongFormat: true });
      } else if (fileSize > 2) {
        this.inputRewardFg.get('image').setErrors({ oversized: true });
      } else {
        this.inputRewardFg.get('image').setErrors(null);
        this.inputRewardFg.get('image').setValue(base64String.toString());
        this.imageUrl = base64String.toString();
      }
    };
  }

  public clearImage() {
    this.inputRewardFg.get('image').setErrors(null);
    this.inputRewardFg.get('image').setValue(null);
    this.inputRewardFg.get('image').markAsPristine();
    this.imageUrl = null;
    this.fileName = null;
  }

  public submitForm() {
    const formGroup = this.inputRewardFg;
    let rewardEntryData: RewardEntryDto = new RewardEntryDto();
    let response;

    if (this.isDelete) {
      response = true;
    } else {
      rewardEntryData.name = formGroup.get('name').value.trim();
      rewardEntryData.description = formGroup.get('description').value.trim();
      rewardEntryData.category = formGroup.get('category').value.id;
      rewardEntryData.points = Number(formGroup.get('points').value);
      rewardEntryData.quantity = Number(formGroup.get('quantity').value);
      rewardEntryData.limited = formGroup.get('limited').value;
      const limitedTime = formGroup.get('limitedTime').value;
      rewardEntryData.image = formGroup.get('image').value;

      if (limitedTime != null)
        rewardEntryData.limitedTime = new Date(limitedTime + "Z").toISOString();
      else rewardEntryData.limitedTime = null;

      if (this.isAdd) {
        rewardEntryData.createdBy = this.userId;
        response = rewardEntryData;
      } else if (this.isEdit) {
        rewardEntryData.modifiedBy = this.userId;
        response = rewardEntryData;
      }
    }

    this.dialogRef.close(response);
  }
}
