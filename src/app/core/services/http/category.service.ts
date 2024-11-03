import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pageable } from '../../models/pageable.model';
import { Category, CategoryEntryDto } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = environment.STS_BASE_URL + '/category';

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.baseUrl}`);
  }

  getCategoriesPageable(page: number, size: number): Observable<Pageable> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.httpClient.get<Pageable>(`${this.baseUrl}/pageable`, { params: params });
  }

  postCategory(category: CategoryEntryDto): Observable<Category> {
    return this.httpClient.post<Category>(`${this.baseUrl}`, category);
  }

  putCategory(
    category: CategoryEntryDto,
    categoryId: number
  ): Observable<Category> {
    return this.httpClient.put<Category>(
      `${this.baseUrl}/${categoryId}`,
      category
    );
  }

  deletCategory(categoryId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/${categoryId}`);
  }
}
