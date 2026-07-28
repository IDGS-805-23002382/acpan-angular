import { Component, inject } from '@angular/core';
import { MockDataService } from '../../../core/data/mock-data.service';

@Component({
  selector: 'app-mis-productos',
  standalone: true,
  templateUrl: './mis-productos.html',
})
export class MisProductos {
  private data = inject(MockDataService);
  productosAdquiridos = [...new Set(this.data.comprasCliente.map((c) => c.productoId))]
    .map((id) => this.data.getProductoPorId(id))
    .filter((p) => !!p);
}
