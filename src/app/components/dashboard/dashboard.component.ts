import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatePaymentModalComponent } from '../create-payment-modal/create-payment-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreatePaymentModalComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  @ViewChild('addPaymentModal', { static: false }) addPaymentModal!: TemplateRef<any>;

  initialDate: string = this.formatDate(new Date());
  finalDate: string = this.formatDate(new Date());

  selectedStatus: string = 'Todos';
  selectedCategory: string = 'Todos';
  selectedPaymentMethod: string = 'Todos';

  statuses = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'APPROVED', label: 'Aprovado' },
    { value: 'CANCELED', label: 'Cancelado' }
  ];
  categories = [
    { value: 'LEISURE', label: 'Lazer' },
    { value: 'STUDIES', label: 'Estudos' },
    { value: 'FOOD', label: 'Alimentação' },
    { value: 'HOUSING', label: 'Moradia' },
    { value: 'TRANSPORT', label: 'Transporte' },
    { value: 'TRIPS', label: 'Viagens' },
    { value: 'HEALTH', label: 'Saúde' }
  ];
  paymentMethods = [
    { value: 'MONEY', label: 'Dinheiro' },
    { value: 'PIX', label: 'Pix' },
    { value: 'DEBIT_CARD', label: 'Cartão de débito' },
    { value: 'CRED_CARD', label: 'Cartão de crédito' }
  ];

  allData: Payment[] = [];
  filteredData: Payment[] = [];
  totalAmount: number = 0;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private modalService: NgbModal
  ) {}

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

    // Aplicando filtros
    if (this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(payment => payment.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'Todos') {
      filtered = filtered.filter(payment => payment.status === this.selectedStatus);
    }

    if (this.selectedPaymentMethod !== 'Todos') {
      filtered = filtered.filter(payment => payment.paymentMethod === this.selectedPaymentMethod);
    }

    // Atualizando dados filtrados e calculando total
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

  openCreatePaymentModal() {
    const modalRef = this.modalService.open(CreatePaymentModalComponent);
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.paymentMethods = this.paymentMethods;
    modalRef.componentInstance.statuses = this.statuses;

    modalRef.result.then((result) => {
      if (result === 'save') {
        this.applyFilters();
      }
      this.applyFilters();
    }).catch((error) => {
      this.applyFilters();
    });
  }

  openConfirmDialog(paymentId: number) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = 'Tem certeza de que deseja excluir este pagamento?';

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.deletePayment(paymentId);
        }
      },
      (reason) => {
        console.log('Cancelado', reason);
      }
    );
  }

  deletePayment(paymentId: number) {
    this.paymentService.delete(paymentId).subscribe(() => {
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
    this.initialDate = (document.getElementById('startDate') as HTMLInputElement)?.value || '';
    this.finalDate = (document.getElementById('endDate') as HTMLInputElement)?.value || '';
    this.applyFilters(); // Reaplica os filtros ao alterar as datas
  }
}
