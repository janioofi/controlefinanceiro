import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { Payment } from '../models/payment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url: string = `${ API_CONFIG.baseUrl }/payment`;

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

  paymentsPeriod(initialDate: string, finalDate: string){
    let params = new HttpParams()
    .set('initialDate', initialDate)
    .set('finalDate', finalDate);
    return this.http.get<Payment[]>(`${this.url}/period`, {params});
  }
}
