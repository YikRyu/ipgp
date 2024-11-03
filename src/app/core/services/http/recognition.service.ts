import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Recognition,
  RecognitionEntryDto,
  RecognitionUpdateDto,
} from '../../models/recognition.mode';
import { Pageable } from '../../models/pageable.model';

@Injectable({ providedIn: 'root' })
export class RecognitionService {
  private baseUrl = environment.STS_BASE_URL + '/recognitions';

  constructor(private httpClient: HttpClient) {}

  getMyRecognitions(
    page: number,
    size: number,
    userId: string
  ): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/${userId}`, {
      params: params,
    });
  }

  getApprovalRecognitions(
    page: number,
    size: number,
    userId: string
  ): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/approval/${userId}`, {
      params: params,
    });
  }

  getPeerRecognitions(
    page: number,
    size: number,
    userId: string
  ): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/peer/${userId}`, {
      params: params,
    });
  }

  getAllRecognitions(page: number, size: number) : Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}`, {
      params: params,
    });
  }

  getRecognitionsForTransactions(recognitionIds: number[]): Observable<Recognition[]>{
    let params = new HttpParams();
    recognitionIds.map((recognitionId)=>{
      params = params.append('recognitionId', recognitionId.toString());
    });
    return this.httpClient.get<Recognition[]>(`${this.baseUrl}/transactions`, {
      params: params,
    });
  }

  postRecognition(recognition: RecognitionEntryDto): Observable<Recognition> {
    return this.httpClient.post<Recognition>(`${this.baseUrl}`, recognition);
  }

  putRecognition(
    recognition: RecognitionUpdateDto,
    recognitionId: number
  ): Observable<Recognition> {
    return this.httpClient.put<Recognition>(
      `${this.baseUrl}/${recognitionId}`,
      recognition
    );
  }
}
