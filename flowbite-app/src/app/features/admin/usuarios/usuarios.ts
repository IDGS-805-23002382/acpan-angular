import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../core/data/mock-data.service';
import { Usuario } from '../../../core/models/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
})
export class UsuariosAdmin {
  private data = inject(MockDataService);
  usuarios = signal<Usuario[]>(this.data.usuarios);
  modalAbierto = signal(false);
  usuarioEnEdicion = signal<Partial<Usuario> | null>(null);

  nuevoUsuario() {
    this.usuarioEnEdicion.set({ nombre: '', correo: '', rol: 'cliente', estatus: 'activo' });
    this.modalAbierto.set(true);
  }

  editarUsuario(u: Usuario) {
    this.usuarioEnEdicion.set({ ...u });
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.usuarioEnEdicion.set(null);
  }

  guardarUsuario() {
    const editado = this.usuarioEnEdicion();
    if (!editado) return;

    // POST/PUT /api/usuarios — el administrador registra al cliente y el
    // backend le envía sus credenciales de acceso por correo electrónico.
    this.usuarios.update((lista) => {
      if (editado.id) {
        return lista.map((u) => (u.id === editado.id ? ({ ...u, ...editado } as Usuario) : u));
      }
      const nuevo: Usuario = {
        id: Math.max(0, ...lista.map((u) => u.id)) + 1,
        nombre: editado.nombre ?? '',
        correo: editado.correo ?? '',
        rol: (editado.rol as 'admin' | 'cliente') ?? 'cliente',
        estatus: (editado.estatus as 'activo' | 'inactivo') ?? 'activo',
        fechaRegistro: new Date().toISOString().slice(0, 10),
      };
      return [nuevo, ...lista];
    });

    this.cerrarModal();
  }

  toggleEstatus(u: Usuario) {
    this.usuarios.update((lista) =>
      lista.map((x) => (x.id === u.id ? { ...x, estatus: x.estatus === 'activo' ? 'inactivo' : 'activo' } : x))
    );
  }
}
