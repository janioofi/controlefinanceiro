import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // Importar MatDatepickerModule
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'; // Importar MatNativeDateModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatSelectModule } from '@angular/material/select'; // Importar MatSelectModule
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { PaymentService } from '../../services/payment.service'; // Importar PaymentService
import { Payment } from '../../models/payment'; // Importar Payment
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Configuração de localidade para datas
    { provide: MAT_DATE_FORMATS, useValue: {
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMM YYYY',
      },
      parse: {
        dateInput: 'DD/MM/YYYY',
      },
    }},
  ],
})
export class DashboardComponent implements OnInit {
  initialDate : Date | null = new Date();
  finalDate: Date | null = new Date();
  selectedStatus: string | null = null;
  selectedCategory: string | null = null;
  selectedPaymentMethod: string | null = null;
  statuses = ['Pendente', 'Aprovado', 'Cancelado'];
  categories = ['Lazer', 'Estudos', 'Alimentação', 'Moradia', 'Transporte', 'Viagens', 'Saúde'];
  paymentMethods = ['Dinheiro', 'Pix', 'Cartão de débito', 'Cartão de crédito'];
  filteredData: Payment[] = [];
  totalAmount: number = 0;

  constructor(private paymentService: PaymentService, private router: Router,  public dialog: MatDialog) {}


  ngOnInit() {
    this.loadDefaultData();
  }

  loadDefaultData() {
    // Load data for today by default
    this.initialDate = this.finalDate = new Date();
    this.applyFilters();
  }

  applyFilters() {
    if (this.initialDate && this.finalDate) {
      // Formatar as datas para YYYY-MM-DD
      const formattedStartDate = this.formatDate(this.initialDate);
      const formattedEndDate = this.formatDate(this.finalDate);

      this.paymentService.findPeriod(formattedStartDate, formattedEndDate)
        .subscribe(data => {
          this.filteredData = data;
          this.calculateTotalAmount();
        });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateTotalAmount() {
    this.totalAmount = this.filteredData.reduce((total, payment) => total + payment.value, 0);
  }

  redirectToCreate() {
    this.router.navigate(['/create']); // Redireciona para a rota 'create'
  }

  editPayment(id: number) {
    this.router.navigate([`/edit/${id}`]); // Redireciona para a rota de edição do pagamento
  }
  removePayment(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.delete(id).subscribe(() => {
          this.filteredData = this.filteredData.filter(payment => payment.idPayment !== id);
          this.calculateTotalAmount();
        });
      }
    });
  }
}
