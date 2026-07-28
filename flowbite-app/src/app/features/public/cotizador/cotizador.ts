import { Component, computed, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';

interface DatosCotizacion {
  nombre: string;
  correo: string;
  telefono: string;
  empresa: string;
  productoId: number | null;
  cantidad: number;
  superficieHectareas: number;
  incluyeInstalacion: boolean;
  mesesMonitoreo: number;
}

const COSTO_INSTALACION_BASE = 3500;
const COSTO_INSTALACION_POR_HECTAREA = 250;
const COSTO_MONITOREO_MENSUAL = 450;

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './cotizador.html',
})
export class Cotizador {
  private data = inject(MockDataService);
  productos = this.data.productos;

  form = signal<DatosCotizacion>({
    nombre: '',
    correo: '',
    telefono: '',
    empresa: '',
    productoId: this.productos[0]?.id ?? null,
    cantidad: 1,
    superficieHectareas: 1,
    incluyeInstalacion: true,
    mesesMonitoreo: 12,
  });

  cotizacionGenerada = signal(false);

  productoSeleccionado = computed(() => this.data.getProductoPorId(this.form().productoId ?? -1));

  // Método de costeo: precio base del equipo * cantidad, más instalación
  // (costo fijo + variable por hectárea) y el plan de monitoreo mensual.
  // Aplica descuento por volumen a partir de 10 unidades.
  desglose = computed(() => {
    const f = this.form();
    const producto = this.productoSeleccionado();
    const subtotalEquipo = (producto?.precioBase ?? 0) * f.cantidad;
    const costoInstalacion = f.incluyeInstalacion
      ? COSTO_INSTALACION_BASE + COSTO_INSTALACION_POR_HECTAREA * f.superficieHectareas
      : 0;
    const costoMonitoreo = COSTO_MONITOREO_MENSUAL * f.mesesMonitoreo;
    const subtotal = subtotalEquipo + costoInstalacion + costoMonitoreo;
    const porcentajeDescuento = f.cantidad >= 10 ? 0.12 : f.cantidad >= 5 ? 0.06 : 0;
    const descuento = subtotal * porcentajeDescuento;
    const total = subtotal - descuento;

    return {
      subtotalEquipo,
      costoInstalacion,
      costoMonitoreo,
      porcentajeDescuento,
      descuento,
      total,
    };
  });

  actualizar<K extends keyof DatosCotizacion>(campo: K, valor: DatosCotizacion[K]) {
    this.form.update((f) => ({ ...f, [campo]: valor }));
  }

  generarCotizacion() {
    this.cotizacionGenerada.set(true);
  }
}
