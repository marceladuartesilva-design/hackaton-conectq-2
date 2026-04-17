export interface Announcement {
  id: string;
  type: 'new_api' | 'update' | 'maintenance' | 'deprecation' | 'news';
  title: string;
  summary: string;
  content: string;
  date: string;
  pinned: boolean;
}

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    type: 'new_api',
    title: 'Nueva API de Renovaciones disponible',
    summary: 'Automatiza la renovación de pólizas con nuestra nueva API. Soporta renovación automática, manual y con cambios de cobertura.',
    content: 'La API de Renovaciones permite gestionar el ciclo completo de renovación de pólizas. Incluye endpoints para consultar pólizas próximas a vencer, ejecutar renovaciones automáticas y aplicar cambios de cobertura durante la renovación.',
    date: '2026-04-15',
    pinned: true,
  },
  {
    id: '2',
    type: 'update',
    title: 'Cotización de Seguros actualizada a v2.1',
    summary: 'Nuevos campos de respuesta con desglose de coberturas y descuentos aplicables. Compatible con v2.',
    content: 'La versión 2.1 de la API de Cotización incluye desglose detallado de coberturas por plan, descuentos por fidelidad y nuevos filtros por rango de prima. La v2 sigue activa y compatible.',
    date: '2026-04-12',
    pinned: false,
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Mantenimiento programado — 20 de abril',
    summary: 'Ventana de mantenimiento de 2 horas para mejoras de infraestructura. APIs de Pagos y Emisión afectadas.',
    content: 'El domingo 20 de abril de 2:00 AM a 4:00 AM (hora Colombia) realizaremos mantenimiento en los servicios de Pagos y Emisión. Las demás APIs no se verán afectadas. El Sandbox estará disponible normalmente.',
    date: '2026-04-10',
    pinned: true,
  },
  {
    id: '4',
    type: 'news',
    title: 'Conecta 2.0 ahora soporta MCP para agentes de IA',
    summary: 'Expón nuestras APIs a tus agentes de IA mediante el protocolo Model Context Protocol (MCP).',
    content: 'El nuevo endpoint /api/v1/mcp/tools permite que agentes de IA descubran y consuman las APIs de Seguros Bolívar de forma autónoma. Incluye metadatos semánticos, ejemplos y schemas completos.',
    date: '2026-04-08',
    pinned: false,
  },
  {
    id: '5',
    type: 'deprecation',
    title: 'API de Modificaciones v1 será retirada el 15 de julio',
    summary: 'La v1 de Modificaciones entrará en retiro. Migra a la v2 antes del 15 de julio de 2026.',
    content: 'La versión 1 de la API de Modificaciones será marcada como retirada el 15 de julio de 2026. A partir de esa fecha, las solicitudes recibirán status 410 (Gone). La v2 ya está disponible con mejoras en validación y nuevos tipos de endoso.',
    date: '2026-04-05',
    pinned: false,
  },
  {
    id: '6',
    type: 'update',
    title: 'Mejoras en el Dashboard de Consumo',
    summary: 'Nuevos filtros por aplicación, exportación de métricas en CSV y alertas personalizables de cuota.',
    content: 'El Dashboard ahora permite filtrar métricas por aplicación individual, exportar datos en CSV para análisis externo y configurar umbrales personalizados para alertas de cuota (antes fijo en 80%).',
    date: '2026-04-01',
    pinned: false,
  },
];
