import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url: string = `${ API_CONFIG.baseUrl }/v1/payments`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Payment[]>{
    return this.http.get<Payment[]>(this.url);
  }

  create(payment: Payment){
    return this.http.post(this.url, payment);
  }

  findById(id: any): Observable<Payment>{
    return this.http.get<Payment>(`${this.url}/${id}`);
  }

  update(payment: Payment): Observable<Payment>{
    return this.http.put<Payment>(`${ this.url }/${payment.idPayment}`, payment);
  }

  delete(id: any): Observable<Payment>{
    return this.http.delete<Payment>(`${ this.url }/${id}`);
  }

  findPeriod(initialDate: string, finalDate: string){
    let params = new HttpParams()
    .set('initialDate', initialDate)
    .set('finalDate', finalDate);
    return this.http.get<Payment[]>(`${this.url}/period`, {params});
  }
}
