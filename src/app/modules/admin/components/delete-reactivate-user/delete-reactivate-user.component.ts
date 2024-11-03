import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-reactivate-user',
  templateUrl: './delete-reactivate-user.component.html',
  styleUrls: ['./delete-reactivate-user.component.scss']
})
export class DeleteReactivateUserComponent {
  public isDelete: boolean = this.data.isDelete;
  public isReactivate: boolean = this.data.isReactivate;
  public name: string = this.data.user.name;
  public id: string = this.data.user.id;
  public email: string = this.data.user.email;

  constructor(
    private dialogRef: MatDialogRef<DeleteReactivateUserComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  public closeDialog(){
    this.dialogRef.close();
  }

  public onConfirm(){
    this.dialogRef.close(true);
  }
}
