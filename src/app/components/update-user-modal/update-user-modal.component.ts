import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css']
})
export class UpdateUserModalComponent implements OnInit {
  @Input() user: any; // Recebe o usuário do componente pai
  updateUserForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.user) {
      this.updateUserForm.patchValue({
        username: this.user.username,
      });
    }
  }

  private initializeForm() {
    this.updateUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  save() {
    if (this.updateUserForm.valid) {
      this.userService.update(this.user.idUser, this.updateUserForm.value).subscribe(() => {
        this.toastr.success("Usuário atualizado com  sucesso");
        this.activeModal.close('save');
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

  deleteUser() {
    if (confirm('Tem certeza de que deseja excluir este usuário?')) {
      this.userService.delete(this.user.idUser).subscribe(() => {
        this.toastr.success("Usuário excluído com sucesso");
        this.activeModal.close('delete');
      }, ex => {
        this.toastr.error("Erro ao excluir usuário");
      });
    }
  }
}
