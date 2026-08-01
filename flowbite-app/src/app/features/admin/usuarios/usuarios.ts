import { Component, signal, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Usuario } from "../../../core/models/models";
import { AuthService } from "../../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-usuarios",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./usuarios.html",
})
export class UsuariosAdmin implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = "https://localhost:7227/api/users";

  usuarios = signal<Usuario[]>([]);
  modalAbierto = signal(false);
  usuarioEnEdicion = signal<Partial<Usuario> | null>(null);

  usuarioActualId: string = "";

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarUsuarios();
  }

  cargarUsuarioActual() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.usuarioActualId =
          payload.sub ||
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ||
          "";
      } catch (e) {
        console.error("No se pudo leer el token para obtener el ID actual", e);
      }
    }
  }

  private getAuthHeaders() {
    const token = (this.authService.getToken() as string) || "";
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  cargarUsuarios() {
    this.http
      .get<Usuario[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (data) => {
          this.usuarios.set(data);
        },
        error: (err) => {
          console.error("Error al cargar los usuarios de la API", err);
        },
      });
  }

  nuevoUsuario() {
    this.usuarioEnEdicion.set({
      nombreCompleto: "",
      email: "",
      roles: ["Cliente"],
    });
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

    if (editado.id) {
      const rolSeleccionado = Array.isArray(editado.roles)
        ? editado.roles[0]
        : editado.roles || "Cliente";
      this.http
        .post(
          `${this.apiUrl}/${editado.id}/role`,
          JSON.stringify(rolSeleccionado),
          { headers: this.getAuthHeaders() },
        )
        .subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cerrarModal();
            Swal.fire({
              icon: "success",
              title: "¡Rol actualizado!",
              text: "El rol del usuario se ha modificado correctamente.",
              confirmButtonColor: "#7c3aed",
            });
          },
          error: (err) => {
            console.error("Error al actualizar rol", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo actualizar el rol.",
              confirmButtonColor: "#7c3aed",
            });
          },
        });
    } else {
      const rolAEliminarOGuardar = Array.isArray(editado.roles)
        ? editado.roles[0]
        : editado.roles || "Cliente";

      this.http
        .post(
          this.apiUrl,
          {
            nombre: editado.nombreCompleto,
            correo: editado.email,
            rol: rolAEliminarOGuardar,
          },
          { headers: this.getAuthHeaders() },
        )
        .subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cerrarModal();
            Swal.fire({
              icon: "success",
              title: "¡Usuario registrado!",
              text: "Se le ha enviado un correo con su contraseña temporal.",
              confirmButtonColor: "#7c3aed",
            });
          },
          error: (err) => {
            console.error("Error detallado al registrar usuario:", err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Revisa la consola, hubo un error al guardar.",
              confirmButtonColor: "#7c3aed",
            });
          },
        });
    }
  }

  toggleEstatus(u: Usuario) {
    if (!u.id) return;

    this.http
      .post(
        `${this.apiUrl}/${u.id}/status`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .subscribe({
        next: () => {
          this.cargarUsuarios();
          Swal.fire({
            icon: "success",
            title: "¡Estatus actualizado!",
            text: "El estado del usuario se ha modificado correctamente.",
            confirmButtonColor: "#7c3aed",
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error("Error al cambiar estatus", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cambiar el estatus del usuario.",
            confirmButtonColor: "#7c3aed",
          });
        },
      });
  }

  reenviarCorreo(usuario: Usuario) {
    if (!usuario.id) return;

    this.http
      .post(
        `${this.apiUrl}/${usuario.id}/reset-password`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: "success",
            title: "¡Correo reenviado!",
            text: `Se han restablecido las credenciales y enviado a ${usuario.email}`,
            confirmButtonColor: "#7c3aed",
          });
        },
        error: (err) => {
          console.error("Error al reenviar credenciales", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el correo con las nuevas credenciales.",
            confirmButtonColor: "#7c3aed",
          });
        },
      });
  }
}
