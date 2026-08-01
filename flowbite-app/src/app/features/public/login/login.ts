import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./login.html",
})
export class Login {
  rol = signal<"cliente" | "admin">("admin");
  correo = signal("");
  password = signal("");
  errorMessage = signal("");
  mostrarPassword = signal(false);
  cargando = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  cambiarRol(rol: "cliente" | "admin") {
    this.rol.set(rol);
  }

  togglePassword() {
    this.mostrarPassword.update((value) => !value);
  }

  ingresar() {
    this.errorMessage.set("");
    this.cargando.set(true);

    const credentials = {
      correo: this.correo(),
      password: this.password(),
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Añadimos un pequeño respiro visual de 400ms para que la animación luzca profesional
        setTimeout(() => {
          this.cargando.set(false);
          if (response.success && response.token) {
            const userRole = this.authService.getRoleFromToken(response.token);

            if (userRole === "admin") {
              this.router.navigate(["/admin"]);
            } else {
              this.router.navigate(["/cliente"]);
            }
          } else {
            this.errorMessage.set(
              "Cuenta o contraseña inválida, inténtelo de nuevo.",
            );
          }
        }, 300);
      },
      error: () => {
        setTimeout(() => {
          this.cargando.set(false);
          this.errorMessage.set(
            "Cuenta o contraseña inválida, inténtelo de nuevo.",
          );
        }, 1000);
      },
    });
  }
}
