import { Category } from './../models/category';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url: string = `${ API_CONFIG.baseUrl }/category`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Category[]>{
    return this.http.get<Category[]>(this.url);
  }

  create(category: Category){
    return this.http.post(this.url, category);
  }

  findById(id: any): Observable<Category>{
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  update(category: Category): Observable<Category>{
    return this.http.put<Category>(`${ this.url }/${category.idCategory}`, category);
  }
}
