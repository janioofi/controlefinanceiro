import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    FooterComponent
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{

  login: String = localStorage.getItem('email')

  isSidenavOpened = true;
  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.router.navigate(['dashboard'])
  }


  logout() {
    this.router.navigate(['login'])
    this.authService.logout();
    this.toast.info("Logout realizado com sucesso", "Logout", { timeOut: 10000 })
  }

}
