import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Register } from '../../models/register';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
})
export class RegisterModalComponent {

  username = new FormControl('', [Validators.minLength(3), Validators.maxLength(50), Validators.required]);
  password = new FormControl('', [Validators.minLength(3), Validators.maxLength(255), Validators.required]);
  confirmPassword = new FormControl('', [Validators.minLength(3), Validators.maxLength(255), Validators.required]);

  constructor(
    public activeModal: NgbActiveModal,
    private service: AuthService,
    private toastr: ToastrService
  ) {}

  register() {
    if (this.username.valid && this.password.valid && this.confirmPassword.valid) {
      const registerInfo: Register = {
        username: this.username.value!,
        password: this.password.value!,
        confirmPassword: this.confirmPassword.value!,
      };

      this.service.register(registerInfo).subscribe(res => {
        this.toastr.success(res.body);
        this.activeModal.close();
      }, ex => {
        if (ex.error.errors) {
          ex.error.errors.forEach(element => {
            this.toastr.error(element.message);
          });
        } else {
          this.toastr.error(ex.error);
        }
      });
    }
  }
}
