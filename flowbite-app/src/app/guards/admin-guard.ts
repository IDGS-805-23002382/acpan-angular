import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    const userRole = authService.getRoleFromToken(token);
    // Si es admin, tiene pase VIP
    if (userRole === "admin") {
      return true;
    }
  }

  // Si no tiene token o si su rol es otro (ej. cliente queriendo entrar a admin), lo rebotamos
  router.navigate(["/login"]);
  return false;
};
