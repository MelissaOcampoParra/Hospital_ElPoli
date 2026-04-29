import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly saludo = this.computeSaludo();

  private computeSaludo(): string {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return '¡Buenos días!';
    if (h >= 12 && h < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  }
}
