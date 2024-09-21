import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
    private baseUrl = environment.STS_BASE_URL + '/auth';

    constructor(
      private httpClient: HttpClient
    ){}

    login(email: string, password: string): Observable<User>{
      let requestBody = {
        email: email,
        password: password
      };
      return this.httpClient.post<User>(`${this.baseUrl}`, requestBody);
    }
}
