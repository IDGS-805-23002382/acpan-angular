import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Proveedor } from '../../../core/models/models';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './proveedores.html',
})
export class Proveedores {
  private data = inject(MockDataService);
  proveedores = signal<Proveedor[]>(this.data.proveedores);
  modalAbierto = signal(false);
  proveedorEnEdicion = signal<Partial<Proveedor> | null>(null);

  nuevo() {
    this.proveedorEnEdicion.set({ nombre: '', contacto: '', correo: '', telefono: '', estatus: 'activo' });
    this.modalAbierto.set(true);
  }

  editar(p: Proveedor) {
    this.proveedorEnEdicion.set({ ...p });
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.proveedorEnEdicion.set(null);
  }

  guardar() {
    const editado = this.proveedorEnEdicion();
    if (!editado) return;

    // POST/PUT /api/proveedores
    this.proveedores.update((lista) => {
      if (editado.id) {
        return lista.map((p) => (p.id === editado.id ? ({ ...p, ...editado } as Proveedor) : p));
      }
      const nuevo: Proveedor = {
        id: Math.max(0, ...lista.map((p) => p.id)) + 1,
        nombre: editado.nombre ?? '',
        contacto: editado.contacto ?? '',
        correo: editado.correo ?? '',
        telefono: editado.telefono ?? '',
        estatus: (editado.estatus as 'activo' | 'inactivo') ?? 'activo',
      };
      return [nuevo, ...lista];
    });

    this.cerrarModal();
  }
}
