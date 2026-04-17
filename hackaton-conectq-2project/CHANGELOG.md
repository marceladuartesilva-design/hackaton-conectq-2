# Changelog — Conecta 2.0

## [v1.1.1] - 2026-04-17

### Cambios
- Sección de planes de consumo (Mensual $350.000/mes y Transaccional $65/llamada) agregada a la página pública
- Planes visibles entre el catálogo de APIs y el CTA de registro para que el cliente los conozca antes de registrarse
- Cada plan con precio, descripción, features y botón "Elegir plan" que lleva al onboarding

## [v1.1.0] - 2026-04-17

### Cambios
- Página de inicio (/) ahora muestra la experiencia pública con catálogo de APIs directamente
- / y /explore apuntan al mismo contenido público con PublicLayout
- Links de login, onboarding y header público actualizados para apuntar a /

## [v1.0.2] - 2026-04-17

### Cambios
- Fix: ruta raíz (/) ahora muestra la landing comercial correctamente usando Route index
- Reordenamiento de rutas para evitar conflicto entre Layout anidado y ruta raíz

## [v1.0.1] - 2026-04-17

### Cambios
- Logo actualizado al diseño oficial: cuadrado dorado con silueta de familia en verde Bolívar (#006838)
- Texto "SEGUROS" con tracking amplio + "Bolívar" en bold, verde oscuro oficial
- Favicon actualizado con el mismo ícono de familia sobre fondo dorado

## [v1.0.0] - 2026-04-17

### Cambios
- Landing page comercial como entrada principal (/) con hero, stats, APIs, beneficios, planes, testimoniales y CTA
- Selección de plan (Mensual/Transaccional) movida al onboarding como paso 4 de 5
- Sandbox simplificado sin selector de plan — ejecución directa
- Reestructuración de rutas: / landing pública, /home portal autenticado, /explore catálogo público

## [v0.9.0] - 2026-04-17

### Cambios
- Panel de administración reconstruido como experiencia separada (/admin) con header propio
- 6 tabs: Resumen (KPIs, pendientes, top consumidores), Aliados, Aplicaciones, APIs, Auditoría, Comunicaciones
- Gestión de aplicaciones con plan mensual/transaccional, consumo visual y revocación de API Keys
- Gobierno de versiones de APIs con acciones de deprecar/retirar y publicación de nuevas versiones
- CRUD de comunicaciones para administradores con tipos, fijado y acciones editar/eliminar

## [v0.8.0] - 2026-04-17

### Cambios
- Sección de novedades y comunicaciones con 6 tipos: nueva API, actualización, mantenimiento, deprecación, novedad
- Anuncios expandibles con "Leer más", soporte de fijados (pinned) y filtros por tipo
- Vista compacta en Home (3 recientes) y página dedicada /announcements con filtros completos
- Nuevo ítem "Novedades" en el nav del header autenticado

## [v0.7.0] - 2026-04-17

### Cambios
- Modal de selección de plan de cobro antes de la primera ejecución en Sandbox
- Dos planes: Mensual ($350.000/mes, 10.000 llamadas) y Transaccional ($65/llamada)
- Chip de plan activo en el selector de API, clickeable para cambiar plan
- Selección de plan se guarda por API y auto-ejecuta el request al confirmar

## [v0.6.0] - 2026-04-17

### Cambios
- Botón "Descargar documentación" en detalle de API (pública y autenticada) con dropdown
- Descarga de documentación completa en Markdown (endpoints, snippets, soporte, autenticación)
- Descarga de OpenAPI Spec 3.0.3 en JSON importable en Postman/Swagger
- Opción de descargar ambos archivos simultáneamente

## [v0.5.0] - 2026-04-17

### Cambios
- Onboarding tour interactivo de 6 slides: Bienvenida, Catálogo, Sandbox, Dashboard, Asistente IA, Comenzar
- Se muestra automáticamente en la primera visita (estado en localStorage)
- Botón de ayuda (?) en el header para repetir el tour en cualquier momento
- Cada slide con descripción, tips prácticos, dots de navegación y opción de omitir

## [v0.4.1] - 2026-04-17

### Cambios
- Componente LogoBolivar (escudo verde con "B") con variantes full/icon y temas light/dark
- Logo integrado en header autenticado, header público, login, home y favicon
- Reemplazado ícono genérico Zap por branding de Seguros Bolívar en todas las pantallas

## [v0.4.0] - 2026-04-17

### Cambios
- Login: CTA prominente en panel izquierdo para explorar catálogo público (desktop y mobile)
- Nueva experiencia pública /explore con layout propio (header blanco, badge "Público", login/registro)
- Detalle público de API (/explore/:id) con banner de invitación a registro para Sandbox
- Login redirige a /dashboard tras MFA (no a home)
- Separación de rutas: /explore público vs /catalog+/sandbox+/dashboard autenticado

## [v0.3.1] - 2026-04-17

### Cambios
- Login: eliminada opción de Magic Link
- Onboarding simplificado a 4 pasos: Empresa → Verificación → Cuenta → Confirmación
- Removidos pasos de selección de API/aplicación y credenciales del registro
- Paso final muestra estado de verificación (24-48h) con resumen de datos

## [v0.3.0] - 2026-04-17

### Cambios
- Botón "Cerrar sesión" en el header que redirige a /login
- Chatbot de soporte IA transversal (botón flotante inferior derecho en todas las páginas)
- Chat con respuestas contextuales, quick replies, animación de typing y scroll automático

## [v0.2.1] - 2026-04-17

### Cambios
- Home: eliminados botones de login/registro del hero (ya existe pantalla dedicada)
- Home: removido Panel de Admin del nav y features (portal orientado a clientes)
- Home: sección "Modelos de integración" reemplazada por "¿Por qué Conecta 2.0?" con 4 beneficios
- Header simplificado: solo Catálogo, Sandbox y Dashboard
- Features del home en grid de 3 columnas

## [v0.2.0] - 2026-04-17

### Cambios
- Pantalla de login split-screen con correo + contraseña y toggle de visibilidad
- Doble factor de autenticación (MFA) con código de 6 dígitos, selector TOTP/email
- Opción de inicio con Magic Link y enlace a recuperación de contraseña
- Links a registro de organización y catálogo público desde el login
- Reestructuración de rutas: /login y /onboarding full-screen, botón Login en header

## [v0.1.0] - 2026-04-17

### Cambios
- Scaffolding completo del frontend MVP: React 18 + Vite + TypeScript + Tailwind
- Landing page con hero, features y modelos de integración
- Catálogo de APIs con filtros, detalle de endpoints y snippets de código (JS, Python, cURL)
- Sandbox interactivo con ejecución mock y historial de pruebas
- Dashboard de consumo con métricas, alertas de cuota y gráficos (Recharts)
- Panel de administración con gestión de aliados y logs de auditoría
- Onboarding wizard de 5 pasos con validación y credenciales simuladas
- Hook de changelog automático configurado (agentStop)
