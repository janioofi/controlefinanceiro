import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = `${ API_CONFIG.baseUrl }/v1/user`;

  constructor(private http: HttpClient) { }

  findById(id: any): Observable<User>{
    return this.http.get<User>(`${this.url}/${id}`);
  }

  findByUsername(username: string): Observable<User>{
    return this.http.get<User>(`${this.url}/username/${username}`);
  }

  update(id: string, userData: any): Observable<User>{
    return this.http.put<User>(`${ this.url }/${id}`, userData);
  }
}
