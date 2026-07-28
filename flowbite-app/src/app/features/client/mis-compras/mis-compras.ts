import { Component, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { CompraCliente } from '../../../core/models/models';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './mis-compras.html',
})
export class MisCompras {
  private data = inject(MockDataService);
  compras = signal<CompraCliente[]>(this.data.comprasCliente);
  compraEnResena = signal<CompraCliente | null>(null);
  textoResena = signal('');
  calificacion = signal(5);

  nombreProducto(id: number): string {
    return this.data.getProductoPorId(id)?.nombre ?? '';
  }

  abrirResena(compra: CompraCliente) {
    this.compraEnResena.set(compra);
    this.textoResena.set('');
    this.calificacion.set(5);
  }

  cerrarModal() {
    this.compraEnResena.set(null);
  }

  enviarResena() {
    const compra = this.compraEnResena();
    if (!compra) return;
    // POST /api/comentarios
    this.compras.update((lista) =>
      lista.map((c) => (c.id === compra.id ? { ...c, resenaDejada: true } : c))
    );
    this.cerrarModal();
  }

  estrellas(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
