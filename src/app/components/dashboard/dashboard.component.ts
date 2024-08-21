import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  initialDate: string = this.formatDate(new Date());
  finalDate: string = this.formatDate(new Date());

  selectedStatus: string = 'Todos';
  selectedCategory: string = 'Todos';
  selectedPaymentMethod: string = 'Todos';

  statuses = ['Todos', 'Pendente', 'Aprovado', 'Cancelado'];
  categories = ['Todos', 'Lazer', 'Estudos', 'Alimentação', 'Moradia', 'Transporte', 'Viagens', 'Saúde'];
  paymentMethods = ['Todos', 'Dinheiro', 'Pix', 'Cartão de débito', 'Cartão de crédito'];



  allData: Payment[] = [];
  filteredData: Payment[] = [];
  totalAmount: number = 0;

  constructor(private paymentService: PaymentService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadDefaultData();
  }

  private loadDefaultData() {
    const now = new Date();
    this.initialDate = this.formatDate(new Date(now.setHours(0, 0, 0, 0)));
    this.finalDate = this.formatDate(new Date(now.setHours(23, 59, 59, 999)));
    this.applyFilters();
  }

  applyCategoryStatusPaymentFilters() {
    let filtered = this.allData;

    // Aplique os filtros e verifique o resultado em cada etapa
    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(payment => {
        const match = payment.category === this.selectedCategory;
        return match;
      });
    }

    if (this.selectedStatus !== 'Todos') {
      filtered = filtered.filter(payment => {
        const match = payment.status === this.selectedStatus;
        return match;
      });
    }

    if (this.selectedPaymentMethod !== 'Todos') {
      filtered = filtered.filter(payment => {
        const match = payment.paymentMethod === this.selectedPaymentMethod;
        return match;
      });
    }

    // Atualize os dados filtrados e calcule o total
    this.filteredData = filtered;
    this.calculateTotalAmount();
  }

  applyFilters() {
    const startDate = this.parseDate(this.initialDate);
    const endDate = this.parseDate(this.finalDate);

    if (!(startDate instanceof Date && !isNaN(startDate.getTime()) &&
      endDate instanceof Date && !isNaN(endDate.getTime()))) {
      console.error("initialDate ou finalDate não são objetos Date válidos.");
      return;
    }

    endDate.setHours(23, 59, 59, 999);

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);

    this.paymentService.findPeriod(formattedStartDate, formattedEndDate)
      .subscribe(data => {
        this.allData = data;
        this.applyCategoryStatusPaymentFilters();
      });
  }

  onCategoryChange() {
    this.applyCategoryStatusPaymentFilters();
  }

  onStatusChange() {
    this.applyCategoryStatusPaymentFilters();
  }

  onPaymentMethodChange() {
    this.applyCategoryStatusPaymentFilters();
  }

  // Adicionando o método para abrir o diálogo de criação
  openCreatePaymentDialog(): void {
    // Lógica para abrir um modal ou diálogo
    const modalRef = this.modalService.open(CreatePaymentDialogComponent);
    modalRef.result.then((result) => {
      // Lógica para lidar com o resultado do modal
    }).catch((error) => {
      // Lógica para lidar com o erro do modal
    });
  }

  confirmDelete(id: number): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deletePayment(id);
      }
    }).catch((error) => {
      // Lógica para lidar com o erro do modal
    });
  }

  deletePayment(id: number): void {
    this.paymentService.delete(id).subscribe(() => {
      this.applyFilters();
    });
  }

  private parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculateTotalAmount() {
    this.totalAmount = this.filteredData.reduce((total, payment) => total + payment.value, 0);
  }

  editPayment(id: number) {
    this.router.navigate([`/edit/${id}`]);
  }

  onDateChange() {
    this.initialDate = (<HTMLInputElement>document.getElementById('startDate'))?.value || '';
    this.finalDate = (<HTMLInputElement>document.getElementById('endDate'))?.value || '';
  }
}
