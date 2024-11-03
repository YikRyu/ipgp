import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recognition, RecognitionUpdateDto } from 'src/app/core/models/recognition.mode';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-cancel-recognition',
  templateUrl: './cancel-recognition.component.html',
  styleUrls: ['./cancel-recognition.component.scss']
})
export class CancelRecognitionComponent implements OnInit {
  public recognition: Recognition = this.data.data;
  private userId: string = this.userService.getUserId();

  constructor(
    private dialogRef: MatDialogRef<CancelRecognitionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  public closeDialog(){
    this.dialogRef.close();
  }

  public onConfirm(){
    let admin;

    if(this.recognition.admin == null){
      admin = null;
    }else{
      admin = this.recognition.admin.id;
    }

    let updateRecogntion : RecognitionUpdateDto = {
      points: this.recognition.points,
      status: 'cancel',
      refereeApproval: this.recognition.refereeApproval,
      admin: admin,
      adminApproval: this.recognition.adminApproval,
      modifiedBy: this.userId,
    };

    this.dialogRef.close(updateRecogntion);
  }

}
