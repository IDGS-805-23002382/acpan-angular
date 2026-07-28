import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.html',
})
export class Contacto {
  nombre = signal('');
  correo = signal('');
  mensaje = signal('');
  enviado = signal(false);

  enviar() {
    // Aquí se llamará al endpoint POST /api/contacto del Back-End.
    this.enviado.set(true);
  }
}
