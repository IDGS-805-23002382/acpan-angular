import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    const userRole = authService.getRoleFromToken(token);

    // 🛡️ ACCESO PERMITIDO: Tanto "admin" como "Empleado" tienen pase a la zona de gestión
    if (userRole === "admin" || userRole === "Empleado") {
      return true;
    }
  }

  // Si no tiene token o si su rol es "Cliente", lo rebotamos al login
  router.navigate(["/login"]);
  return false;
};
