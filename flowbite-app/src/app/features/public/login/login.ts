import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  rol = signal<'cliente' | 'admin'>('cliente');
  correo = signal('');
  password = signal('');

  constructor(private router: Router) {}

  cambiarRol(rol: 'cliente' | 'admin') {
    this.rol.set(rol);
  }

  ingresar() {
    // La validación real de credenciales se hará contra el endpoint
    // POST /api/auth/login del Back-End (ASP.NET Core + JWT).
    this.router.navigate([this.rol() === 'admin' ? '/admin' : '/cliente']);
  }
}
