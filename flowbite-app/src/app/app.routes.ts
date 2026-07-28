import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home').then((m) => m.Home) },
      { path: 'productos', loadComponent: () => import('./features/public/productos/productos').then((m) => m.Productos) },
      { path: 'productos/:slug', loadComponent: () => import('./features/public/producto-detalle/producto-detalle').then((m) => m.ProductoDetalle) },
      { path: 'cotizador', loadComponent: () => import('./features/public/cotizador/cotizador').then((m) => m.Cotizador) },
      { path: 'contacto', loadComponent: () => import('./features/public/contacto/contacto').then((m) => m.Contacto) },
      { path: 'login', loadComponent: () => import('./features/public/login/login').then((m) => m.Login) },
    ],
  },
  {
    path: 'cliente',
    loadComponent: () => import('./core/layouts/client-layout/client-layout').then((m) => m.ClientLayout),
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', loadComponent: () => import('./features/client/perfil/perfil').then((m) => m.Perfil) },
      { path: 'mis-productos', loadComponent: () => import('./features/client/mis-productos/mis-productos').then((m) => m.MisProductos) },
      { path: 'mis-compras', loadComponent: () => import('./features/client/mis-compras/mis-compras').then((m) => m.MisCompras) },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./core/layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard) },
      { path: 'usuarios', loadComponent: () => import('./features/admin/usuarios/usuarios').then((m) => m.UsuariosAdmin) },
      { path: 'comentarios', loadComponent: () => import('./features/admin/comentarios/comentarios').then((m) => m.ComentariosAdmin) },
      { path: 'proveedores', loadComponent: () => import('./features/admin/proveedores/proveedores').then((m) => m.Proveedores) },
      { path: 'compras', loadComponent: () => import('./features/admin/compras/compras').then((m) => m.ComprasAdmin) },
      { path: 'materia-prima', loadComponent: () => import('./features/admin/materia-prima/materia-prima').then((m) => m.MateriaPrima) },
      { path: 'productos', loadComponent: () => import('./features/admin/productos/productos-admin').then((m) => m.ProductosAdmin) },
    ],
  },
  { path: '**', redirectTo: '' },
];
