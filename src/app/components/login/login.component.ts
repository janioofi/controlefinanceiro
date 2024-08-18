import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    {provide: ToastrService, useClass: ToastrService}
  ]
})
export class LoginComponent implements OnInit {

  login: Login = {
    email: '',
    password: '',
  };

  email = new FormControl(null, Validators.minLength(11));
  password = new FormControl(null, Validators.minLength(4));

  constructor(
    private title: Title,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.title.setTitle("Login")
  }

  logar() {
    this.service.authenticate(this.login).subscribe(res => {
      let token = JSON.parse(res.body).token
      this.service.successFullLogin(token, this.login.email)
      this.router.navigate(['']);
    }, ((err) => {
      console.log(err.status);
      if (err.status === 403) {
        this.toastr.error('Acesso expirado ou login incorreto');
        this.service.logout();
      }
     })
    );
  }

  registrar() {
    this.service.register(this.login).subscribe(res => { // Tipando a resposta como HttpResponse
      this.toastr.success(res.body);
    }, ((ex) => {
      if(ex.error.errors){
        ex.error.errors.forEach(element => {
          this.toastr.error(element.message);
        })
      }else{
        this.toastr.error(ex.error);
      }
     })
    );
  }

  validaCampos(): boolean{
    return this.email.valid && this.password.valid
  }


}
