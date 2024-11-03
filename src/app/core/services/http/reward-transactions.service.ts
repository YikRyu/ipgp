import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RewardTransaction } from "../../models/reward-transaction.model";
import { Pageable } from "../../models/pageable.model";

@Injectable({providedIn: 'root'})
export class RewardTransactionsService{
  private baseUrl = environment.STS_BASE_URL + '/pointsTransactions';
  
  constructor(
    private httpClient: HttpClient,
  ){}

  public getTransactions(userId: string, page: number, size: number): Observable<Pageable>{
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    return this.httpClient.get<Pageable>(`${this.baseUrl}/${userId}`, {params: params});
  }

  public getChartRewardTransactions(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.baseUrl}/chart`);
  }

  public postTransaction(points: number, rewardTransaction: string, userId: string): Observable<RewardTransaction>{
    let newRewardTransaction = {
      points: points,
      rewards: rewardTransaction,
      userId: userId
    };
    return this.httpClient.post<RewardTransaction>(`${this.baseUrl}`, newRewardTransaction);
  }
}