import { MatGridListModule } from '@angular/material/grid-list';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    RouterLink,
    NgFor
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  ELEMENT_DATA: Payment[] = []

  totalValue = 0;

  displayedColumns: string[] = ['idPayment', 'description', 'value', 'category', 'status', 'paymentDate', 'paymentMethod'];
  dataSource = new MatTableDataSource<Payment>(this.ELEMENT_DATA);

  constructor(
    private service: PaymentService,
    private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Clientes")
    this.findAll();
  }

  findAll() {
    this.service.findAll().pipe().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Payment>(response)
      this.totalValue = 0;
      this.ELEMENT_DATA.forEach(element => {
        this.totalValue += parseFloat(element.value)
      });
    });
  }
}
