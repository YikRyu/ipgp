import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import {
  Recognition,
  RecognitionUpdateDto,
} from 'src/app/core/models/recognition.mode';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-recognition-details',
  templateUrl: './recognition-details.component.html',
  styleUrls: ['./recognition-details.component.scss'],
})
export class RecognitionDetailsComponent implements OnInit {
  public isAdmin: boolean;
  public isUpdate: boolean = this.data.isUpdate;
  public recognition: Recognition = this.data.data;
  public userId: string = this.userService.getUserId();
  public disabled: boolean = true;
  public recognitionType: string = null;
  public isSubmitDisabled: boolean = true;
  public isSubmitting: boolean = false;
  public recognitionTypeList: string[] = ['self', 'peer'];
  public inputRecognitionForm = {
    points: [0],
    status: [''],
    refereeApproval: [''],
    adminApproval: [''],
  };
  public inputRecognitionFg: FormGroup = this.fb.group(
    this.inputRecognitionForm
  );
  public validateMessages = {
    points: [
      {
        type: 'required',
        message: 'Please provide points or put as 0!',
      },
    ],
  };

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecognitionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.validateForm();
    this.userService.isAdmin$
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  private initializeData() {
    const inputFg = this.inputRecognitionFg;
    this.recognitionType = this.recognition.type;

    inputFg.get('points').setValue(this.recognition.points);

    if (this.recognitionType == 'self') {
      if (this.recognition.refereeApproval != null)
        inputFg
          .get('refereeApproval')
          .setValue(this.recognition.refereeApproval);
      else inputFg.get('refereeApproval').setValue(null);
    }

    if (this.recognition.adminApproval != null) {
      inputFg.get('adminApproval').setValue(this.recognition.adminApproval);
    }else inputFg.get('adminApproval').setValue(null);

    if(this.isAdmin){
      inputFg.get('points').setValidators([Validators.required]);
      inputFg.get('points').updateValueAndValidity();
    }
  }

  private validateForm() {
    this.inputRecognitionFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if(this.isAdmin){
          if(!this.inputRecognitionFg.get('points').pristine && this.inputRecognitionFg.get('points').invalid) this.isSubmitDisabled = true;
          else this.isSubmitDisabled = false;
        }else this.isSubmitDisabled = false;
      });
  }

  public getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-danger';
      case 'cancel':
        return 'text-secondary';
      default:
        return 'text-dark';
    }
  }

  public setApproval(type: string, approval: boolean) {
    switch (type) {
      case 'admin':
        this.inputRecognitionFg.get('adminApproval').setValue(approval);
        break;
      case 'referee':
        this.inputRecognitionFg.get('refereeApproval').setValue(approval);
        break;
    }
  }

  public disableApprovalAndPoints(recognition: Recognition): boolean{
    if(recognition.type == 'self'){
      if(this.isUpdate && this.isAdmin && recognition.createdBy.id != this.userId) return true;
      else return false;
    }else{
      if(this.isUpdate && this.isAdmin && recognition.createdBy.id != this.userId && recognition.peer.id != this.userId) return true;
      else return false;
    }
    
  }

  public submitForm() {
    this.isSubmitting = true;
    let formInput = this.inputRecognitionFg;
    const adminApproval = formInput.get('adminApproval').value;
    const refereeApproval = formInput.get('refereeApproval').value;
    let updateRecognition: RecognitionUpdateDto = new RecognitionUpdateDto();

    updateRecognition.points = formInput.get('points').value;
    updateRecognition.adminApproval = adminApproval;
    updateRecognition.refereeApproval = refereeApproval;
    updateRecognition.modifiedBy = this.userId;

    if (formInput.get('adminApproval').value != null) {
      updateRecognition.admin = this.userId;
    }

    if (this.recognitionType == 'self') {
      if((adminApproval != null && adminApproval == true ) && (refereeApproval != null && refereeApproval == true)){
        updateRecognition.status = 'approved';
      }else if((adminApproval != null && adminApproval == false ) || (refereeApproval != null && refereeApproval == false)){
        updateRecognition.status = 'rejected';
      }else{
        updateRecognition.status = 'pending';
      }
    }else{
      if(adminApproval != null && adminApproval == true ) updateRecognition.status = 'approved';
      else if(adminApproval != null && adminApproval == false ) updateRecognition.status = 'rejected';
      else if(adminApproval == null) updateRecognition.status = 'pending';
    }
    
    this.dialogRef.close(updateRecognition);
  }
}
