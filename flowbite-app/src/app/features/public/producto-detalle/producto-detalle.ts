import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MockDataService } from '../../../core/data/mock-data.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private data = inject(MockDataService);

  private slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), { initialValue: '' });

  producto = computed(() => this.data.getProductoPorSlug(this.slug()));
  comentarios = computed(() =>
    this.data.comentarios.filter((c) => c.revisado && c.productoId === this.producto()?.id)
  );

  tabActiva = signal<'descripcion' | 'especificaciones' | 'documentos'>('descripcion');

  cambiarTab(tab: 'descripcion' | 'especificaciones' | 'documentos') {
    this.tabActiva.set(tab);
  }

  estrellas(n: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }
}
