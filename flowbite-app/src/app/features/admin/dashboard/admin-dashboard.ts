import { Component, inject, signal, OnInit } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { MockDataService } from "../../../core/data/mock-data.service";
import { Usuario } from "../../../core/models/models";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: "./admin-dashboard.html",
})
export class AdminDashboard implements OnInit {
  private data = inject(MockDataService);
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7227/api/users";

  usuarios = signal<Usuario[]>([]);

  totalUsuarios = 0;
  totalClientesActivos = 0;

  comentariosPendientes = this.data.comentarios.filter((c) => !c.revisado)
    .length;
  comprasPendientes = this.data.compras.filter((c) => c.estatus === "pendiente")
    .length;
  insumosBajoStock = this.data.insumos.filter((i) => i.stock <= i.stockMinimo);
  ultimasCompras = this.data.compras.slice(0, 5);

  ngOnInit() {
    this.cargarUsuariosDashboard();
  }

  cargarUsuariosDashboard() {
    this.http.get<Usuario[]>(this.apiUrl).subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
        this.totalUsuarios = lista.length;

        this.totalClientesActivos = lista.filter((u: any) => {
          const rolStr = Array.isArray(u.roles) ? u.roles[0] : u.roles;
          const esCliente =
            typeof rolStr === "string" && rolStr.toLowerCase() === "cliente";
          const esActivo =
            u.estatus === true ||
            u.estatus === "activo" ||
            u.estatus === undefined;

          return esCliente && esActivo;
        }).length;
      },
      error: (err) => {
        console.error("Error al cargar usuarios en el dashboard", err);
      },
    });
  }

  nombreProveedor(id: number): string {
    return this.data.proveedores.find((p) => p.id === id)?.nombre ?? "";
  }
}
