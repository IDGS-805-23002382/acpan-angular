import { Component, signal, inject } from '@angular/core';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Comentario } from '../../../core/models/models';

@Component({
  selector: 'app-comentarios-admin',
  standalone: true,
  templateUrl: './comentarios.html',
})
export class ComentariosAdmin {
  private data = inject(MockDataService);
  comentarios = signal<Comentario[]>(this.data.comentarios);

  nombreProducto(id: number): string {
    return this.data.getProductoPorId(id)?.nombre ?? '';
  }

  marcarRevisado(c: Comentario) {
    // PATCH /api/comentarios/:id { revisado: true }
    this.comentarios.update((lista) => lista.map((x) => (x.id === c.id ? { ...x, revisado: true } : x)));
  }

  eliminar(c: Comentario) {
    // DELETE /api/comentarios/:id
    this.comentarios.update((lista) => lista.filter((x) => x.id !== c.id));
  }

  estrellas(n: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }
}
