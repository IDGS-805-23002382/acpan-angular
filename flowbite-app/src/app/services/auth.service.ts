import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://localhost:7227/api/Auth";

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          this.setToken(response.token);
        }
      }),
    );
  }

  private setToken(token: string): void {
    localStorage.setItem("jwtToken", token); // Cambiado a localStorage
  }

  getToken(): string | null {
    return localStorage.getItem("jwtToken"); // Cambiado a localStorage
  }

  logout(): void {
    localStorage.removeItem("jwtToken"); // Cambiado a localStorage
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
}
