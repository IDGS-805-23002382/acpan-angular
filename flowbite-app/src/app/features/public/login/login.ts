import {
  Component,
  inject,
  signal,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import Swal from "sweetalert2";

// Declaramos la variable global de Google reCAPTCHA para evitar que TypeScript chille
declare var grecaptcha: any;

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./login.html",
})
export class Login implements OnDestroy, AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Modelo para el login tradicional
  loginData = {
    correo: "",
    password: "",
  };

  // Variables de control visual requeridas por tu interfaz
  mostrarPassword = signal<boolean>(false);
  cargando = signal<boolean>(false);
  mensajeError = signal<string>("");

  // Variables para controlar el flujo de la verificación en dos pasos (2FA)
  requiere2FA = signal<boolean>(false);
  correoPara2FA = signal<string>("");
  codigoOtp = signal<string>("");

  // Controles de Cooldown para evitar saturación de correos
  cooldownReenvio = signal<number>(0);
  private intervaloTimer: any;

  // Forzamos a Google reCAPTCHA a renderizarse explícitamente en el DOM al cargar la vista
  ngAfterViewInit() {
    setTimeout(() => {
      const contenedorCaptcha = document.querySelector(".g-recaptcha");
      if (typeof grecaptcha !== "undefined" && contenedorCaptcha) {
        grecaptcha.render(contenedorCaptcha, {
          sitekey: "6LdY9XAtAAAAADmgpNkzap74jCWxi-A8dJrSKKgx",
        });
      }
    }, 250);
  }

  // Alternar visualización del ojito en el input de clave
  togglePassword() {
    this.mostrarPassword.update((v) => !v);
  }

  iniciarSesion() {
    this.mensajeError.set("");

    if (!this.loginData.correo || !this.loginData.password) {
      this.mensajeError.set("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    // Recuperamos la respuesta del CAPTCHA
    const captchaResponse = grecaptcha?.getResponse();
    if (!captchaResponse) {
      this.mensajeError.set("Por favor, completa el CAPTCHA de seguridad.");
      return;
    }

    this.cargando.set(true);

    const payload = {
      ...this.loginData,
      captchaToken: captchaResponse,
    };

    // Petición inicial usando el AuthService
    this.authService.login(payload).subscribe({
      next: (res) => {
        this.cargando.set(false);

        // Si el backend responde que hace falta el segundo paso obligatorio
        if (res.requiere2FA) {
          this.correoPara2FA.set(res.email);
          this.requiere2FA.set(true);
          this.iniciarTimerCooldown(); // Bloqueamos reenvíos por 60s inmediatamente

          Swal.fire({
            icon: "info",
            title: "Código enviado",
            html: "Hemos enviado un código de verificación a tu correo.<br><span class='text-gray-600 text-sm font-medium'>(Si no lo encuentras, revisa en spam o correo no deseado).</span>",
            confirmButtonColor: "#7c3aed",
          });
        } else {
          this.completarAutenticacion(res.token);
        }
      },
      error: (err) => {
        this.cargando.set(false);
        console.error(err);
        grecaptcha?.reset();
        this.mensajeError.set(
          err.error?.message ||
            "Cuenta o contraseña inválida, inténtalo de nuevo.",
        );
      },
    });
  }

  verificarCodigo() {
    this.mensajeError.set("");

    if (!this.codigoOtp() || this.codigoOtp().length < 6) {
      this.mensajeError.set(
        "Por favor, introduce el código completo de 6 dígitos.",
      );
      return;
    }

    this.cargando.set(true);

    const payload = {
      email: this.correoPara2FA(),
      codigo: this.codigoOtp(),
    };

    this.authService.verify2FA(payload).subscribe({
      next: (res) => {
        this.cargando.set(false);
        const tokenFinal = res.token || res.Token;

        // 1. Guardamos el token en memoria inmediatamente
        this.authService.saveToken(tokenFinal);

        const nombreUsuario =
          this.authService.getUserNameFromToken?.(tokenFinal) ||
          this.correoPara2FA().split("@")[0];

        // 🚀 2. LANZAMIENTO EN SIMULTÁNEO
        // Al dejarlos juntos en el mismo bloque síncrono, JavaScript procesa ambas instrucciones en el mismo ciclo del procesador
        this.redireccionarPorRol(tokenFinal);

        Swal.fire({
          icon: "success",
          title: `¡Bienvenido de nuevo, ${nombreUsuario}!`,
          text: "Bienvenido.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.cargando.set(false);
        console.error(err);
        this.mensajeError.set(
          err.error?.message ||
            "El código introducido es incorrecto o ya expiró.",
        );
      },
    });
  }

  // Modificación idéntica para la autenticación directa (Fase 1)
  private completarAutenticacion(token: string) {
    this.authService.saveToken(token);

    const nombreUsuario =
      this.authService.getUserNameFromToken?.(token) || "Usuario";

    // 🚀 Lanzamiento en simultáneo para el flujo directo
    this.redireccionarPorRol(token);

    Swal.fire({
      icon: "success",
      title: `¡Bienvenido, ${nombreUsuario}!`,
      text: "Bienvenido.",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  // Función para separar los caminos de Admin, Empleado y Cliente dinámicamente
  private redireccionarPorRol(token: string) {
    const rol = this.authService.getRoleFromToken(token);
    const rolNormalizado = rol?.toLowerCase();

    // 🚀 ACTUALIZACIÓN: Tanto 'admin' como el nuevo rol 'empleado' entran al dashboard /admin
    if (
      rolNormalizado === "admin" ||
      rolNormalizado === "administrador" ||
      rolNormalizado === "empleado"
    ) {
      this.router.navigate(["/admin"]);
    } else if (rolNormalizado === "cliente") {
      this.router.navigate(["/cliente"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  // Lógica para el botón de reenvío controlado
  reenviarCodigo() {
    if (this.cooldownReenvio() > 0 || this.cargando()) return;

    this.cargando.set(true);
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.cargando.set(false);
        this.iniciarTimerCooldown(); // Reiniciamos el bloqueo de 60s
        Swal.fire({
          icon: "success",
          title: "Código reenviado",
          text: "Se ha generado un nuevo token de acceso en tu bandeja.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.cargando.set(false);
        this.mensajeError.set(
          err.error?.message || "Error al solicitar nuevo código.",
        );
      },
    });
  }

  iniciarTimerCooldown() {
    this.cooldownReenvio.set(60);
    if (this.intervaloTimer) clearInterval(this.intervaloTimer);

    this.intervaloTimer = setInterval(() => {
      this.cooldownReenvio.update((v) => v - 1);
      if (this.cooldownReenvio() <= 0) {
        clearInterval(this.intervaloTimer);
      }
    }, 1000);
  }

  // Permite al usuario regresar al formulario si se equivocó de dirección
  cancelar2FA() {
    this.requiere2FA.set(false);
    this.codigoOtp.set("");
    this.mensajeError.set("");
    setTimeout(() => {
      const contenedorCaptcha = document.querySelector(".g-recaptcha");
      if (typeof grecaptcha !== "undefined" && contenedorCaptcha) {
        grecaptcha.render(contenedorCaptcha, {
          sitekey: "6LdY9XAtAAAAADmgpNkzap74jCWxi-A8dJrSKKgx",
        });
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.intervaloTimer) clearInterval(this.intervaloTimer);
  }
}
