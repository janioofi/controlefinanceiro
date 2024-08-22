import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-payment-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './update-payment-modal.component.html',
  styleUrls: ['./update-payment-modal.component.css']
})
export class UpdatePaymentModalComponent implements OnInit {
  @Input() paymentId: string = '';
  paymentForm!: FormGroup;

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
    { value: 'CRED_CARD', label: 'Cartão de crédito' }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.paymentId) {
      this.loadPaymentData();
    }
  }

  private initializeForm() {
    this.paymentForm = this.fb.group({
      description: ['', Validators.required],
      paymentDate: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  private loadPaymentData() {
    this.paymentService.findById(this.paymentId).subscribe(payment => {
      // Mapeia os valores recebidos para os valores esperados pelo formulário
      const categoryMap = {
        'Lazer': 'LEISURE',
        'Estudos': 'STUDIES',
        'Alimentação': 'FOOD',
        'Moradia': 'HOUSING',
        'Transporte': 'TRANSPORT',
        'Viagens': 'TRIPS',
        'Saúde': 'HEALTH'
      };

      const paymentMethodMap = {
        'Dinheiro': 'MONEY',
        'Pix': 'PIX',
        'Cartão de débito': 'DEBIT_CARD',
        'Cartão de crédito': 'CRED_CARD'
      };

      const statusMap = {
        'Pendente': 'PENDING',
        'Aprovado': 'APPROVED',
        'Cancelado': 'CANCELED'
      };

      // Preenche o formulário com os dados mapeados
      this.paymentForm.patchValue({
        description: payment.description,
        paymentDate: payment.paymentDate,
        value: payment.value,
        category: categoryMap[payment.category] || '',
        paymentMethod: paymentMethodMap[payment.paymentMethod] || '',
        status: statusMap[payment.status] || ''
      });
    });
  }


  save() {
    if (this.paymentForm.valid) {
      this.paymentService.update(this.paymentId, this.paymentForm.value).subscribe(() => {
        this.activeModal.close('save');
      });
    }
  }
}
