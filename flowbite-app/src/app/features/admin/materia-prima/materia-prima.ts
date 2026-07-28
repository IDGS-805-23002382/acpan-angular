import { Component, computed, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Insumo } from '../../../core/models/models';

@Component({
  selector: 'app-materia-prima',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './materia-prima.html',
})
export class MateriaPrima {
  private data = inject(MockDataService);
  insumos = signal<Insumo[]>(this.data.insumos);
  modalAbierto = signal(false);
  insumoEnEdicion = signal<Partial<Insumo> | null>(null);

  valorTotalInventario = computed(() =>
    this.insumos().reduce((acc, i) => acc + i.costoUnitario * i.stock, 0)
  );

  proveedoresDisponibles = this.data.proveedores;

  proveedor(id: number): string {
    return this.data.proveedores.find((p) => p.id === id)?.nombre ?? '';
  }

  nuevo() {
    this.insumoEnEdicion.set({ nombre: '', unidad: 'pieza', costoUnitario: 0, stock: 0, stockMinimo: 0, proveedorId: this.data.proveedores[0]?.id });
    this.modalAbierto.set(true);
  }

  editar(i: Insumo) {
    this.insumoEnEdicion.set({ ...i });
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.insumoEnEdicion.set(null);
  }

  guardar() {
    const editado = this.insumoEnEdicion();
    if (!editado) return;

    // POST/PUT /api/insumos
    // Método de costeo: costo promedio ponderado. Cuando entra una nueva
    // compra del mismo insumo, el nuevo costoUnitario se recalcula como
    // (stockActual*costoActual + cantidadComprada*costoCompra) / (stockActual+cantidadComprada).
    this.insumos.update((lista) => {
      if (editado.id) {
        return lista.map((i) => (i.id === editado.id ? ({ ...i, ...editado } as Insumo) : i));
      }
      const nuevo: Insumo = {
        id: Math.max(0, ...lista.map((i) => i.id)) + 1,
        nombre: editado.nombre ?? '',
        unidad: editado.unidad ?? 'pieza',
        costoUnitario: Number(editado.costoUnitario) || 0,
        stock: Number(editado.stock) || 0,
        stockMinimo: Number(editado.stockMinimo) || 0,
        proveedorId: Number(editado.proveedorId),
      };
      return [nuevo, ...lista];
    });

    this.cerrarModal();
  }
}
