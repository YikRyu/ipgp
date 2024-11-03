import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserEntryDto, UserUpdateDto } from '../../models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pageable } from '../../models/pageable.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = environment.STS_BASE_URL + '/auth';

  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    let requestBody = {
      email: email,
      password: password,
    };
    return this.httpClient.post<User>(`${this.baseUrl}`, requestBody);
  }

  getUser(userId: string): Observable<User>{
    return this.httpClient.get<User>(`${this.baseUrl}/user/${userId}`);
  }

  getAllUsers(search: string, userId: string): Observable<User[]>{
    let params = new HttpParams();
    params = params.append('search', search);
    params = params.append('userId', userId);
    return this.httpClient.get<User[]>(`${this.baseUrl}/allUsers`, {params: params});
  }

  getUsers(page: number, size: number, userId: string): Observable<Pageable>{
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('userId', userId);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/users`, { params: params });
  }
  
  getAdmins(page: number, size: number, userId: string): Observable<Pageable>{
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('userId', userId);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/admins`, { params: params });
  }

  postUser(newUser: UserEntryDto): Observable<User>{
    return this.httpClient.post<User>(`${this.baseUrl}/newUser`, newUser);
  }

  putUser(userUpdate :UserUpdateDto , userId: string): Observable<User>{
    return this.httpClient.put<User>(`${this.baseUrl}/updateUser/${userId}`, userUpdate);
  }

  updatePoints(points: number, userId: string): Observable<User>{
    return this.httpClient.put<User>(`${this.baseUrl}/updatePoints/${userId}?points=${points}`, null);
  }

  updatePassword(oldPassword: string, newPassword: string, userId: string): Observable<User>{
    let body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
    return this.httpClient.put<User>(`${this.baseUrl}/updatePassword/${userId}`, body);
  }

  reactivateUser(userId: string): Observable<User>{
    return this.httpClient.put<User>(`${this.baseUrl}/reactivateUser/${userId}`, null);
  }

  deleteUser(userId: string): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.baseUrl}/${userId}`);
  }
}
