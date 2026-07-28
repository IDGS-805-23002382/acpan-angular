import { Component, computed, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/data/mock-data.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './productos.html',
})
export class Productos {
  private data = inject(MockDataService);
  categoriaActiva = signal<string>('Todos');

  categorias = computed(() => {
    const cats = new Set(this.data.productos.map((p) => p.categoria));
    return ['Todos', ...cats];
  });

  productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    return cat === 'Todos' ? this.data.productos : this.data.productos.filter((p) => p.categoria === cat);
  });

  seleccionarCategoria(cat: string) {
    this.categoriaActiva.set(cat);
  }
}
