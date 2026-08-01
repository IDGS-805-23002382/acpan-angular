// Modelos compartidos. Reflejan (a alto nivel) las entidades que expondrá
// el Back-End en ASP.NET Core vía API REST. Los datos que se ven en el
// front por ahora son "mock" para poder maquetar sin depender del backend.

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  categoria: string;
  resumen: string;
  descripcion: string;
  imagen: string;
  precioBase: number;
  destacado?: boolean;
  especificaciones: { label: string; valor: string }[];
  documentos: {
    nombre: string;
    tipo: "manual" | "ficha" | "video";
    url: string;
  }[];
}

export interface Insumo {
  id: number;
  nombre: string;
  unidad: string;
  costoUnitario: number;
  stock: number;
  stockMinimo: number;
  proveedorId: number;
}

export interface RecetaItem {
  insumoId: number;
  cantidad: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  correo: string;
  telefono: string;
  estatus: "activo" | "inactivo";
}

export interface Compra {
  id: number;
  proveedorId: number;
  fecha: string;
  total: number;
  estatus: "pendiente" | "recibida" | "cancelada";
  items: { insumoId: number; cantidad: number; costoUnitario: number }[];
}

export interface Usuario {
  id?: string;
  nombreCompleto?: string;
  email?: string;
  fechaRegistro?: string;
  roles?: string[];
  estatus?: boolean;
}

export interface Comentario {
  id: number;
  clienteNombre: string;
  productoId: number;
  calificacion: number; // 1-5
  texto: string;
  fecha: string;
  revisado: boolean;
}

export interface CompraCliente {
  id: number;
  productoId: number;
  fecha: string;
  total: number;
  resenaDejada: boolean;
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}
