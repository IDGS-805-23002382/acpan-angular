import { Component, signal, inject, OnInit } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms"; // 👈 Importante para los inputs del modal
import { AuthService } from "../../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule], // 👈 Agregamos FormsModule aquí
  templateUrl: "./admin-layout.html",
})
export class AdminLayout implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  menuMovilAbierto = signal(false);

  // Signals para pintar el perfil dinámico en el header
  nombreUsuario = signal<string>("Usuario");
  inicialesUsuario = signal<string>("U");

  // Control del modal de contraseña propia
  modalPasswordAbierto = signal(false);

  // Objeto para enlazar los campos del formulario
  passwordData = {
    passwordActual: "",
    nuevaPassword: "",
  };

  ngOnInit() {
    this.cargarPerfilDesdeToken();
  }

  toggleMenu() {
    this.menuMovilAbierto.update((v) => !v);
  }

  cargarPerfilDesdeToken() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // 🔍 Buscamos en todas las variantes posibles de claims de .NET Identity
        const nombre =
          payload.NombreCompleto ||
          payload.unique_name ||
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] ||
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
          ] ||
          "Administrador";

        this.nombreUsuario.set(nombre);

        // Generar iniciales limpias basadas en el nombre obtenido
        const iniciales = nombre
          .split(" ")
          .filter((n: string) => n.length > 0)
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        this.inicialesUsuario.set(iniciales || "AD");
      } catch (e) {
        console.error("No se pudo decodificar el token para el header", e);
      }
    }
  }

  abrirModalPassword() {
    this.passwordData = { passwordActual: "", nuevaPassword: "" };
    this.modalPasswordAbierto.set(true);
  }

  cerrarModalPassword() {
    this.modalPasswordAbierto.set(false);
  }

  cambiarPassword() {
    if (!this.passwordData.passwordActual || !this.passwordData.nuevaPassword) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, llena ambos campos de contraseña.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    const token = this.authService.getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // EL PAYLOAD EXACTO PARA EL DTO DE C#
    const payload = {
      PasswordActual: this.passwordData.passwordActual,
      NuevaPassword: this.passwordData.nuevaPassword,
      ConfirmarPassword: this.passwordData.nuevaPassword, // Enviamos la misma para cumplir el [Compare] del backend
    };

    this.http
      .post(
        "https://localhost:7227/api/auth/change-password",
        payload, // 👈 Enviamos el payload corregido en lugar de passwordData
        { headers },
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            title: "¡Contraseña actualizada!",
            text: "Tu contraseña se modificó con éxito. Ya no necesitas la clave temporal.",
            confirmButtonColor: "#7c3aed",
          });
          this.cerrarModalPassword();
        },
        error: (err) => {
          console.error("Error al cambiar contraseña:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.error?.message ||
              "No se pudo actualizar la contraseña. Verifica tu clave actual.",
            confirmButtonColor: "#7c3aed",
          });
        },
      });
  }
}
