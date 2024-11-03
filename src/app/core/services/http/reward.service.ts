import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pageable } from '../../models/pageable.model';
import { BulkQuantityUpdateDto, ChartRewardDto, Reward, RewardEntryDto } from '../../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {
  private baseUrl = environment.STS_BASE_URL + '/reward';

  constructor(private httpClient: HttpClient) {}

  getRewards(page: number, size: number): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}`, { params: params });
  }

  getActiveRewards(page: number, size: number): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/active`, {
      params: params,
    });
  }

  getRewardsDetails(rewardIds: number[]): Observable<Reward[]> {
    let params = new HttpParams();
    rewardIds.map((rewardId) => {
      params = params.append('rewardId', rewardId);
    });
    return this.httpClient.get<Reward[]>(`${this.baseUrl}/details`, {
      params: params,
    });
  }

  getChartRewards(rewardIds: number[]): Observable<ChartRewardDto[]> {
    return this.httpClient.post<ChartRewardDto[]>(`${this.baseUrl}/chart`, rewardIds);
  }

  postReward(reward: RewardEntryDto): Observable<Reward>{
    return this.httpClient.post<Reward>(`${this.baseUrl}`, reward);
  }

  putReward(reward: RewardEntryDto, rewardId: number): Observable<Reward>{
    return this.httpClient.put<Reward>(`${this.baseUrl}/${rewardId}`, reward);
  }

  updateQuantity(quantity: number, rewardId: number): Observable<Reward> {
    let params = new HttpParams();
    params = params.append('quantity', quantity.toString());
    return this.httpClient.put<Reward>(`${this.baseUrl}/quantity/${rewardId}?quantity=${quantity}`,null);
  }

  bulkUpdateQuantity(bulkUpdate: BulkQuantityUpdateDto[]): Observable<Reward[]> {
    return this.httpClient.put<Reward[]>(`${this.baseUrl}/quantity/bulk`, bulkUpdate);
  }

  deleteReward(rewardId: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.baseUrl}/${rewardId}`);
  }
}
