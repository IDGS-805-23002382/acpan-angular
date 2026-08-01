import { Injectable } from "@angular/core";
import {
  Comentario,
  Compra,
  CompraCliente,
  Insumo,
  PreguntaFrecuente,
  Producto,
  Proveedor,
  Usuario,
} from "../models/models";

/**
 * Servicio centralizado de datos "mock".
 *
 * Cuando el Back-End ASP.NET Core esté disponible, este servicio se
 * sustituye por llamadas HttpClient a los endpoints REST
 * (ej. GET /api/productos, GET /api/proveedores, etc.) sin tener que
 * tocar los componentes que ya lo consumen, porque exponen la misma forma.
 */
@Injectable({ providedIn: "root" })
export class MockDataService {
  productos: Producto[] = [
    {
      id: 1,
      nombre: "Sensor de Humedad y Temperatura ACPAN-S1",
      slug: "sensor-humedad-temperatura-s1",
      categoria: "Sensores",
      resumen:
        "Monitoreo ambiental en tiempo real para invernaderos y naves industriales.",
      descripcion:
        "Sensor IoT de bajo consumo que reporta humedad relativa y temperatura cada 30 segundos vía LoRaWAN o Wi-Fi. Integra alertas automáticas y respaldo de batería de hasta 12 meses.",
      imagen:
        "https://images.unsplash.com/photo-1581093458791-9d42e3f6b6b0?q=80&w=800&auto=format&fit=crop",
      precioBase: 1850,
      destacado: true,
      especificaciones: [
        { label: "Rango de humedad", valor: "0 - 100% RH" },
        { label: "Rango de temperatura", valor: "-20°C a 60°C" },
        { label: "Conectividad", valor: "Wi-Fi / LoRaWAN" },
        { label: "Batería", valor: "Hasta 12 meses" },
      ],
      documentos: [
        { nombre: "Ficha técnica S1", tipo: "ficha", url: "#" },
        { nombre: "Manual de instalación", tipo: "manual", url: "#" },
        { nombre: "Video de configuración", tipo: "video", url: "#" },
      ],
    },
    {
      id: 2,
      nombre: "Controlador de Riego Inteligente ACPAN-R2",
      slug: "controlador-riego-r2",
      categoria: "Controladores",
      resumen:
        "Automatiza ciclos de riego según humedad de suelo y pronóstico climático.",
      descripcion:
        "Controlador de 8 zonas con válvulas solenoides, programación remota desde la app y aprendizaje automático de patrones de consumo de agua.",
      imagen:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
      precioBase: 4200,
      destacado: true,
      especificaciones: [
        { label: "Zonas", valor: "8 independientes" },
        { label: "Conectividad", valor: "Wi-Fi" },
        { label: "Alimentación", valor: "110-220V / Panel solar opcional" },
      ],
      documentos: [
        { nombre: "Ficha técnica R2", tipo: "ficha", url: "#" },
        { nombre: "Manual de usuario", tipo: "manual", url: "#" },
      ],
    },
    {
      id: 3,
      nombre: "Gateway Industrial ACPAN-G3",
      slug: "gateway-industrial-g3",
      categoria: "Conectividad",
      resumen:
        "Concentra hasta 200 dispositivos IoT y sincroniza con la nube en tiempo real.",
      descripcion:
        "Gateway robusto para ambientes industriales con soporte Modbus, MQTT y respaldo 4G en caso de falla de internet fijo.",
      imagen:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      precioBase: 7600,
      especificaciones: [
        { label: "Dispositivos soportados", valor: "Hasta 200" },
        { label: "Protocolos", valor: "MQTT, Modbus TCP/RTU" },
        { label: "Respaldo", valor: "4G LTE" },
      ],
      documentos: [{ nombre: "Ficha técnica G3", tipo: "ficha", url: "#" }],
    },
    {
      id: 4,
      nombre: "Cámara de Monitoreo IA ACPAN-C1",
      slug: "camara-monitoreo-ia-c1",
      categoria: "Sensores",
      resumen:
        "Detección de plagas y estrés hídrico mediante visión computacional.",
      descripcion:
        "Cámara con procesamiento en el borde (edge AI) que identifica anomalías visuales en cultivos y envía reportes fotográficos automáticos.",
      imagen:
        "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=800&auto=format&fit=crop",
      precioBase: 5300,
      especificaciones: [
        { label: "Resolución", valor: "4K" },
        { label: "Procesamiento", valor: "Edge AI" },
        { label: "Conectividad", valor: "PoE / Wi-Fi" },
      ],
      documentos: [{ nombre: "Ficha técnica C1", tipo: "ficha", url: "#" }],
    },
  ];

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      pregunta:
        "¿Cuánto tiempo tarda la instalación de un sistema IoT completo?",
      respuesta:
        "Depende del tamaño del proyecto, pero en promedio la instalación y puesta en marcha toma entre 3 y 10 días hábiles, incluyendo capacitación al personal.",
    },
    {
      pregunta: "¿Los equipos requieren internet fijo para funcionar?",
      respuesta:
        "No necesariamente. Contamos con opciones de conectividad LoRaWAN y respaldo 4G para sitios sin infraestructura de internet fija.",
    },
    {
      pregunta: "¿Qué incluye la garantía de los dispositivos?",
      respuesta:
        "Todos los dispositivos incluyen 12 meses de garantía por defectos de fabricación y soporte técnico remoto durante ese periodo.",
    },
    {
      pregunta: "¿Puedo solicitar una cotización personalizada?",
      respuesta:
        "Sí, en la sección de Cotización puedes indicar tus necesidades y superficie a cubrir para recibir un costo estimado al instante.",
    },
  ];

  comentarios: Comentario[] = [
    {
      id: 1,
      clienteNombre: "Granja Los Encinos",
      productoId: 2,
      calificacion: 5,
      texto:
        "El controlador de riego redujo nuestro consumo de agua en un 30% desde el primer mes.",
      fecha: "2026-05-12",
      revisado: true,
    },
    {
      id: 2,
      clienteNombre: "Invernaderos del Bajío",
      productoId: 1,
      calificacion: 4,
      texto:
        "Muy buena precisión en los sensores, la app aún puede mejorar en notificaciones.",
      fecha: "2026-06-02",
      revisado: true,
    },
    {
      id: 3,
      clienteNombre: "AgroTech Occidente",
      productoId: 4,
      calificacion: 5,
      texto:
        "La cámara detectó una plaga antes de que fuera visible a simple vista. Excelente inversión.",
      fecha: "2026-07-01",
      revisado: false,
    },
  ];

  proveedores: Proveedor[] = [
    {
      id: 1,
      nombre: "Componentes Electrónicos del Norte",
      contacto: "Luis Ramírez",
      correo: "ventas@cenorte.mx",
      telefono: "477 123 4567",
      estatus: "activo",
    },
    {
      id: 2,
      nombre: "Sensores y Electrónica SA",
      contacto: "Ana Torres",
      correo: "contacto@sensorelec.mx",
      telefono: "55 8765 4321",
      estatus: "activo",
    },
    {
      id: 3,
      nombre: "Importadora IoT Global",
      contacto: "Carlos Peña",
      correo: "compras@iotglobal.com",
      telefono: "33 2345 6789",
      estatus: "inactivo",
    },
  ];

  insumos: Insumo[] = [
    {
      id: 1,
      nombre: "Microcontrolador ESP32",
      unidad: "pieza",
      costoUnitario: 95,
      stock: 320,
      stockMinimo: 50,
      proveedorId: 1,
    },
    {
      id: 2,
      nombre: "Sensor DHT22",
      unidad: "pieza",
      costoUnitario: 68,
      stock: 180,
      stockMinimo: 40,
      proveedorId: 2,
    },
    {
      id: 3,
      nombre: "Carcasa IP65",
      unidad: "pieza",
      costoUnitario: 45,
      stock: 210,
      stockMinimo: 60,
      proveedorId: 1,
    },
    {
      id: 4,
      nombre: "Batería de litio 3.7V",
      unidad: "pieza",
      costoUnitario: 120,
      stock: 95,
      stockMinimo: 30,
      proveedorId: 3,
    },
    {
      id: 5,
      nombre: "Módulo LoRa SX1276",
      unidad: "pieza",
      costoUnitario: 210,
      stock: 60,
      stockMinimo: 20,
      proveedorId: 3,
    },
  ];

  compras: Compra[] = [
    {
      id: 1001,
      proveedorId: 1,
      fecha: "2026-07-02",
      total: 18500,
      estatus: "recibida",
      items: [
        { insumoId: 1, cantidad: 100, costoUnitario: 95 },
        { insumoId: 3, cantidad: 200, costoUnitario: 45 },
      ],
    },
    {
      id: 1002,
      proveedorId: 3,
      fecha: "2026-07-15",
      total: 9600,
      estatus: "pendiente",
      items: [{ insumoId: 5, cantidad: 40, costoUnitario: 210 }],
    },
  ];

  // usuarios: Usuario[] = [
  // { id: 1, nombre: 'María Delgado', correo: 'maria.delgado@acpan.mx', rol: 'admin', estatus: 'activo', fechaRegistro: '2025-11-04' },
  // { id: 2, nombre: 'Granja Los Encinos', correo: 'contacto@losencinos.mx', rol: 'cliente', estatus: 'activo', fechaRegistro: '2026-01-20' },
  // { id: 3, nombre: 'Invernaderos del Bajío', correo: 'admin@invbajio.mx', rol: 'cliente', estatus: 'activo', fechaRegistro: '2026-02-11' },
  // { id: 4, nombre: 'AgroTech Occidente', correo: 'operaciones@agrotechoccidente.mx', rol: 'cliente', estatus: 'inactivo', fechaRegistro: '2026-03-05' },
  // ];

  comprasCliente: CompraCliente[] = [
    {
      id: 5001,
      productoId: 2,
      fecha: "2026-04-18",
      total: 4200,
      resenaDejada: true,
    },
    {
      id: 5002,
      productoId: 1,
      fecha: "2026-06-02",
      total: 3700,
      resenaDejada: true,
    },
    {
      id: 5003,
      productoId: 4,
      fecha: "2026-07-10",
      total: 5300,
      resenaDejada: false,
    },
  ];

  getProductoPorSlug(slug: string): Producto | undefined {
    return this.productos.find((p) => p.slug === slug);
  }

  getProductoPorId(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }
}
