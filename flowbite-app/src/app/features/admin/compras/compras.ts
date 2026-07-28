import { Component, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Compra } from '../../../core/models/models';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './compras.html',
})
export class ComprasAdmin {
  private data = inject(MockDataService);
  proveedores = this.data.proveedores;
  insumos = this.data.insumos;
  compras = signal<Compra[]>(this.data.compras);

  detalleAbierto = signal<Compra | null>(null);

  nombreProveedor(id: number): string {
    return this.proveedores.find((p) => p.id === id)?.nombre ?? '';
  }

  nombreInsumo(id: number): string {
    return this.insumos.find((i) => i.id === id)?.nombre ?? '';
  }

  verDetalle(c: Compra) {
    this.detalleAbierto.set(c);
  }

  cerrarDetalle() {
    this.detalleAbierto.set(null);
  }

  cambiarEstatus(c: Compra, estatus: Compra['estatus']) {
    // PATCH /api/compras/:id — al marcar "recibida" el backend debe
    // incrementar el stock de cada insumo en el módulo de Materia Prima.
    this.compras.update((lista) => lista.map((x) => (x.id === c.id ? { ...x, estatus } : x)));
    this.detalleAbierto.update((d) => (d && d.id === c.id ? { ...d, estatus } : d));
  }
}
