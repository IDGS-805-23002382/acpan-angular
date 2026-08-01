import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si tiene token, lo dejamos pasar
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no, lo rebotamos al login
  router.navigate(["/login"]);
  return false;
};
