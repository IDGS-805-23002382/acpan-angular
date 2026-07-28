import { Component, computed, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Insumo, Producto, RecetaItem } from '../../../core/models/models';

// Recetas (explosión de materiales) por producto — en el backend esto
// vivirá en una tabla intermedia producto_insumo (productoId, insumoId, cantidad).
const RECETAS_MOCK: Record<number, RecetaItem[]> = {
  1: [
    { insumoId: 1, cantidad: 1 },
    { insumoId: 2, cantidad: 1 },
    { insumoId: 3, cantidad: 1 },
    { insumoId: 4, cantidad: 1 },
  ],
  2: [
    { insumoId: 1, cantidad: 2 },
    { insumoId: 3, cantidad: 2 },
    { insumoId: 4, cantidad: 2 },
  ],
  3: [
    { insumoId: 1, cantidad: 1 },
    { insumoId: 5, cantidad: 1 },
    { insumoId: 3, cantidad: 1 },
  ],
  4: [
    { insumoId: 1, cantidad: 1 },
    { insumoId: 4, cantidad: 2 },
  ],
};

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './productos-admin.html',
})
export class ProductosAdmin {
  private data = inject(MockDataService);
  productos = this.data.productos;
  insumos = this.data.insumos;

  productoSeleccionadoId = signal<number>(this.productos[0]?.id ?? 0);
  recetas = signal<Record<number, RecetaItem[]>>(RECETAS_MOCK);

  productoSeleccionado = computed(() => this.productos.find((p) => p.id === this.productoSeleccionadoId()));
  recetaActual = computed(() => this.recetas()[this.productoSeleccionadoId()] ?? []);

  costoProduccion = computed(() =>
    this.recetaActual().reduce((acc, item) => {
      const insumo = this.insumos.find((i) => i.id === item.insumoId);
      return acc + (insumo?.costoUnitario ?? 0) * item.cantidad;
    }, 0)
  );

  margen = computed(() => {
    const precio = this.productoSeleccionado()?.precioBase ?? 0;
    const costo = this.costoProduccion();
    return precio > 0 ? ((precio - costo) / precio) * 100 : 0;
  });

  nuevoInsumoId = signal<number | null>(this.insumos[0]?.id ?? null);
  nuevaCantidad = signal<number>(1);

  seleccionarProducto(id: number) {
    this.productoSeleccionadoId.set(id);
  }

  nombreInsumo(id: number): string {
    return this.insumos.find((i) => i.id === id)?.nombre ?? '';
  }

  costoUnitario(id: number): number {
    return this.insumos.find((i) => i.id === id)?.costoUnitario ?? 0;
  }

  agregarInsumoAReceta() {
    const insumoId = this.nuevoInsumoId();
    const cantidad = this.nuevaCantidad();
    if (!insumoId || cantidad <= 0) return;

    // POST /api/productos/:id/receta
    this.recetas.update((r) => {
      const actual = r[this.productoSeleccionadoId()] ?? [];
      const yaExiste = actual.find((i) => i.insumoId === insumoId);
      const actualizada = yaExiste
        ? actual.map((i) => (i.insumoId === insumoId ? { ...i, cantidad } : i))
        : [...actual, { insumoId, cantidad }];
      return { ...r, [this.productoSeleccionadoId()]: actualizada };
    });

    this.nuevaCantidad.set(1);
  }

  quitarInsumo(insumoId: number) {
    this.recetas.update((r) => ({
      ...r,
      [this.productoSeleccionadoId()]: (r[this.productoSeleccionadoId()] ?? []).filter((i) => i.insumoId !== insumoId),
    }));
  }
}
