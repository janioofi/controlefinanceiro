import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from '../../models/payment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-payment-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule

  ],
  templateUrl: './create-payment-modal.component.html',
  styleUrl: './create-payment-modal.component.css'
})
export class CreatePaymentModalComponent {
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;


  newPayment: Payment = {
    description: '',
    category: '',
    paymentMethod: '',
    paymentDate: '',
    value: 0,
    status: ''
  };

  @Input() statuses: { value: string, label: string }[] = [];
  @Input() categories: { value: string, label: string }[] = [];
  @Input() paymentMethods: { value: string, label: string }[] = [];

  constructor(private paymentService: PaymentService, public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  savePayment(paymentForm: any) {
    this.paymentService.create(this.newPayment).subscribe(() => {
      this.modal.close('save');
    });
  }
}
