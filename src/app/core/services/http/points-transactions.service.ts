import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PointsTransaction } from "../../models/points-transaction.model";
import { Pageable } from "../../models/pageable.model";

@Injectable({providedIn: 'root'})
export class PointsTransactionsService{
  private baseUrl = environment.STS_BASE_URL + '/recognitionTransactions';
  
  constructor(private httpClient: HttpClient){}

  public getTransactions(userId: string, page: number, size: number): Observable<Pageable>{
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    return this.httpClient.get<Pageable>(`${this.baseUrl}/${userId}`, {params: params});
  }

  public postTransaction(recognitionId: number, userId: string,): Observable<PointsTransaction>{
    let newTransaction = {
      recognitionId: recognitionId,
      userId: userId
    };
    return this.httpClient.post<PointsTransaction>(`${this.baseUrl}`, newTransaction);
  }
}