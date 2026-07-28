import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MockDataService } from '../../../core/data/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  private data = inject(MockDataService);
  totalUsuarios = this.data.usuarios.length;
  totalClientesActivos = this.data.usuarios.filter((u) => u.rol === 'cliente' && u.estatus === 'activo').length;
  comentariosPendientes = this.data.comentarios.filter((c) => !c.revisado).length;
  comprasPendientes = this.data.compras.filter((c) => c.estatus === 'pendiente').length;
  insumosBajoStock = this.data.insumos.filter((i) => i.stock <= i.stockMinimo);
  ultimasCompras = this.data.compras.slice(0, 5);

  nombreProveedor(id: number): string {
    return this.data.proveedores.find((p) => p.id === id)?.nombre ?? '';
  }
}
