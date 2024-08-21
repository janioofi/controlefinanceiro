import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number;

  constructor() {
    // Define o ano atual
    this.currentYear = new Date().getFullYear();
  }
}
