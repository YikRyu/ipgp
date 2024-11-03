import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { RecognitionEntryDto } from 'src/app/core/models/recognition.mode';
import { User } from 'src/app/core/models/user.model';
import { AuthenticationService } from 'src/app/core/services/http/authentication.service';
import { RecognitionService } from 'src/app/core/services/http/recognition.service';
import { ToastService } from 'src/app/core/services/services/toast.service';
import { UserService } from 'src/app/core/services/services/user.service';

@Component({
  selector: 'app-new-recognition',
  templateUrl: './new-recognition.component.html',
  styleUrls: ['./new-recognition.component.scss']
})
export class NewRecognitionComponent implements OnInit {
  public userId: string = this.userService.getUserId();
  public recognitionType: string = null;
  public isSubmitDisabled: boolean = true;
  public isSubmitting: boolean = false;
  public recognitionTypeList: string[] = ['self', 'peer'];
  public inputNewRecognitionForm = {
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    type: [null, [Validators.required]],
    referee: [''],
    peer: ['']
  };
  public inputNewRecognitionFg: FormGroup = this.fb.group(this.inputNewRecognitionForm);
  public validateMessages = {
    title: [
      {
        type: 'required',
        message: 'Please provide recognition title!',
      },
    ],
    description: [
      {
        type: 'required',
        message: 'Please provide description!',
      }
    ],
    referee: [
      {
        type: 'required',
        message: 'Please assign a referee!',
      }
    ],
    peer: [
      {
        type: 'required',
        message: 'Please assign a peer!',
      }
    ],
  };
  typeahead = (search$: Observable<string>) => 
    search$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search)=>{
        return this.authService.getAllUsers(search, this.userId);
      }),
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return of([]);
      }),
      map((response) => {return response.slice(0,10);}),
    );
  formatter = (result: User) => result.name;


  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthenticationService,
    private recognitionService: RecognitionService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.inputNewRecognitionFg.get('referee').setValue(null);
    this.inputNewRecognitionFg.get('peer').setValue(null);
    this.validateForm();
  }

  private validateForm(){
    this.inputNewRecognitionFg.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        const referee = this.inputNewRecognitionFg.get('referee');
        const peer = this.inputNewRecognitionFg.get('peer');

        if(!referee.pristine && this.recognitionType == 'self' && (referee.value == null || typeof(referee.value) === 'string')){
          referee.setErrors({'required': true});
        }else{
          referee.setErrors(null);
        }

        if(!peer.pristine && this.recognitionType == 'peer' && (peer.value == null || typeof(peer.value) === 'string')){
          peer.setErrors({'required': true});
        }else{
          peer.setErrors(null);
        }

        if (!this.inputNewRecognitionFg.get('title').pristine &&
          !this.inputNewRecognitionFg.get('description').pristine &&
          (!this.inputNewRecognitionFg.get('referee').pristine  || !this.inputNewRecognitionFg.get('peer').pristine) &&
          this.inputNewRecognitionFg.valid) {
          this.isSubmitDisabled = false;
        } else{
          this.isSubmitDisabled = true;
        }
      });
  }

  public selectType(recognitionType: string){
    this.resetField(recognitionType);

    this.inputNewRecognitionFg.get('type').setValue(recognitionType);
    this.recognitionType = recognitionType;
  }

  private resetField(recognitionType: string){
    const referee = this.inputNewRecognitionFg.get('referee');
    const peer = this.inputNewRecognitionFg.get('peer');

    if(recognitionType == 'self'){
      peer.setValue(null);
      peer.setErrors(null);
      peer.markAsPristine();
      referee.markAsDirty();
      referee.setErrors({'requried': true});
    }else if(recognitionType == 'peer'){
      referee.setValue(null);
      referee.setErrors(null);
      referee.markAsPristine();
      peer.markAsDirty();
      peer.setErrors({'required': true});
    }
    
  }

  public submitForm(){
    this.isSubmitting = true;
    this.isSubmitDisabled = true;
    let formInput = this.inputNewRecognitionFg;
    let refereeValue = formInput.get('referee').value;
    let peerValue = formInput.get('peer').value;
    let referee = null;
    let peer = null;

    if(refereeValue != null) referee = refereeValue.id;
    if(peerValue != null) peer = peerValue.id;

    let newRecognition: RecognitionEntryDto = {
      type : this.recognitionType,
      title: formInput.get('title').value.trim(),
      description: formInput.get('description').value,
      points: 0,
      status: 'pending',
      referee: referee,
      peer: peer,
      createdBy: this.userId,
    };

    this.recognitionService.postRecognition(newRecognition).subscribe({
      next: (response)=>{
        this.toastService.showSuccess("New recognition created!");
        this.resetForm();
      },
      error: (error)=>{
        this.isSubmitDisabled = false;
        this.toastService.showError(error.error.message);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  public resetForm(){
    this.recognitionType = null;
    this.inputNewRecognitionFg.reset();
  }
}
