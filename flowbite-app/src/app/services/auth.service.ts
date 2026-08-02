import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://localhost:7227/api/Auth";

  constructor(private http: HttpClient) {}

  // 1. Petición inicial de Login
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // 2. Método para verificar el código OTP de 6 dígitos
  verify2FA(payload: { email: string; codigo: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-2fa`, payload).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          this.saveToken(response.token);
        }
      }),
    );
  }

  saveToken(token: string): void {
    localStorage.setItem("jwtToken", token);
  }

  getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  logout(): void {
    localStorage.removeItem("jwtToken");
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getRoleFromToken(token: string): string | null {
    try {
      const payload = token.split(".")[1];
      const decodedJson = atob(payload);
      const decoded = JSON.parse(decodedJson);

      const roleClaim =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      return decoded[roleClaim] || decoded.role || null;
    } catch (error) {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }

  // Extrae el correo o nombre del usuario desde el JWT y toma la parte previa al @
  // Extrae el identificador del usuario desde el JWT y limpia el correo para mostrar solo el nombre
  getUserNameFromToken(token: string): string | null {
    try {
      const payload = token.split(".")[1];
      const decodedJson = atob(payload);
      const decoded = JSON.parse(decodedJson);

      // Mapea los esquemas tradicionales de correo/nombre de Microsoft Identity
      const emailClaim =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
      const nameClaim =
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

      const identificador =
        decoded[nameClaim] ||
        decoded[emailClaim] ||
        decoded.unique_name ||
        decoded.email;

      if (identificador) {
        // Candado extra: Si el identificador contiene un '@', recortamos para dejar solo el nombre limpio
        return identificador.includes("@")
          ? identificador.split("@")[0]
          : identificador;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener el nombre desde el token", error);
      return null;
    }
  }
}
