import { Component, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/data/mock-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './home.html',
})
export class Home {
  private data = inject(MockDataService);
  productosDestacados = this.data.productos.filter((p) => p.destacado);
  comentarios = this.data.comentarios.filter((c) => c.revisado).slice(0, 3);
  preguntas = this.data.preguntasFrecuentes;
  faqAbierta = signal<number | null>(0);

  toggleFaq(i: number) {
    this.faqAbierta.update((actual) => (actual === i ? null : i));
  }

  nombreProducto(id: number): string {
    return this.data.getProductoPorId(id)?.nombre ?? '';
  }

  estrellas(n: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }
}
