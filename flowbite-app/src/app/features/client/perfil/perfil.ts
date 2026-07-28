import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  nombre = signal('Granja Los Encinos');
  correo = signal('contacto@losencinos.mx');
  telefono = signal('477 555 1234');
  passwordActual = signal('');
  passwordNueva = signal('');
  guardado = signal(false);

  guardarDatos() {
    // PUT /api/clientes/:id
    this.guardado.set(true);
  }
}
