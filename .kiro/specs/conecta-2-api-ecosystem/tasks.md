# Implementation Plan: Conecta 2.0 API Ecosystem

## Overview

Plan de implementación para el prototipo funcional de Conecta 2.0 — portal de autoservicio de APIs de Seguros Bolívar. Enfocado en las funcionalidades demostrables en la hackathon de 1 día: onboarding de aliados, catálogo de APIs, sandbox de pruebas, dashboard de consumo y panel de administración.

Stack: React 18 + Vite + TypeScript + Tailwind + Shadcn UI | Node.js 20 + Express 4 | PostgreSQL 15.4+

Arquitectura: Monorepo con carpetas `frontend/` y `backend/`, queries parametrizadas con `pg`, Zod para validación compartida, JWT + httpOnly cookies para auth.

## Tasks

- [ ] 1. Setup del proyecto y estructura base
  - [ ] 1.1 Inicializar monorepo con estructura de carpetas
    - Crear `conecta-2/` con subcarpetas `frontend/`, `backend/`, `shared/`
    - Configurar `frontend/` con Vite + React 18 + TypeScript + Tailwind + Shadcn UI
    - Configurar `backend/` con Express 4 + TypeScript + ts-node-dev
    - Configurar `shared/` para schemas Zod y types compartidos
    - Crear `docker-compose.yml` con servicios: frontend, backend, postgres
    - Crear `Dockerfile.frontend` y `Dockerfile.backend` multi-stage
    - _Requirements: Decisiones arquitectónicas del design_

  - [ ] 1.2 Configurar base de datos PostgreSQL y migraciones
    - Crear script de migración SQL con todas las tablas principales: `organizations`, `user_allies`, `applications`, `api_definitions`, `api_versions`, `audit_logs`, `notifications`, `consent_records`, `invitations`, `sessions`, `sandbox_requests`
    - Crear índices clave: `idx_organizations_nit`, `idx_user_allies_email`, `idx_audit_logs_correlation`, `idx_api_definitions_search` (GIN full-text)
    - Configurar pool de conexiones con `pg` (driver nativo, sin ORM)
    - Crear seed de datos iniciales: APIs de ejemplo (Cotización, Emisión, Pagos, Consulta, Identidad/SARLAFT), usuario admin, especificaciones OpenAPI de ejemplo
    - _Requirements: Data Models del design, 2.1, 2.6_

  - [ ] 1.3 Configurar middleware stack del backend
    - Implementar middleware en orden: `helmet()`, `cors()`, `correlationId()`, `requestLogger()`, `rateLimiter()`, `express.json()`, `errorHandler()`
    - `correlationId()`: genera UUID v4 y lo propaga en header `X-Correlation-ID`
    - `requestLogger()`: log estructurado JSON con campos: timestamp, level, service, correlation_id, method, path, status_code, duration_ms, message
    - `errorHandler()`: formato de error estandarizado con code, message, details, correlationId
    - Implementar graceful shutdown (SIGTERM → dejar de aceptar conexiones → esperar 30s → cerrar pool PG → exit 0)
    - _Requirements: 8.5, 10.19, 11.3, 11.4, 11.5_

  - [ ]* 1.4 Write property tests para middleware base
    - **Property 19: Correlation ID Propagation** — Verificar que toda respuesta HTTP incluye `X-Correlation-ID` con UUID válido
    - **Validates: Requirements 8.5, 11.3**
    - **Property 28: Security Headers** — Verificar presencia de CSP, X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy en todas las respuestas
    - **Validates: Requirements 10.19**
    - **Property 30: Structured Log Format** — Verificar que cada log entry es JSON válido con todos los campos requeridos
    - **Validates: Requirements 11.4, 11.5**

- [ ] 2. Checkpoint - Verificar setup base
  - Ejecutar `docker-compose up`, verificar que frontend, backend y PostgreSQL levantan correctamente
  - Verificar que las migraciones corren y las tablas se crean
  - Verificar que el seed de datos carga correctamente
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Autenticación y seguridad
  - [ ] 3.1 Implementar servicio de autenticación
    - Registro de usuario: hash de contraseña con bcrypt (cost factor >= 10)
    - Login: verificar credenciales, emitir Access Token JWT (exp 15min) y Refresh Token en httpOnly cookie (Secure, SameSite=Strict, Path=/api/v1/auth/refresh, exp 7d)
    - Refresh endpoint: validar Refresh Token, invalidar el anterior (rotación), emitir nuevos tokens
    - Middleware `authenticate()`: verificar JWT del header `Authorization: Bearer` o API Key del header `X-API-Key`
    - Middleware `authorize(roles)`: verificar RBAC según rol del usuario (Owner, Admin, Developer, Viewer)
    - Validación de contraseña: mínimo 12 caracteres, indicador de fortaleza (débil/aceptable/fuerte)
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6, 10.11, 10.12, 10.13_

  - [ ]* 3.2 Write property tests para autenticación
    - **Property 21: Authentication Middleware** — Requests sin JWT/API Key válido reciben 401 sin detalles internos
    - **Validates: Requirements 10.1, 10.2**
    - **Property 22: JWT Token Configuration** — Access Token exp = 15min desde iat; Refresh Token cookie con httpOnly, Secure, SameSite=Strict
    - **Validates: Requirements 10.4**
    - **Property 23: Refresh Token Rotation** — Token usado se invalida, nuevo token emitido, reuso del viejo falla con 401
    - **Validates: Requirements 10.6**
    - **Property 26: Password Validation** — Contraseñas < 12 chars rechazadas; >= 12 aceptadas; clasificación de fortaleza correcta
    - **Validates: Requirements 10.12, 10.13**

  - [ ] 3.3 Implementar RBAC y permisos
    - Crear matriz de permisos: Owner (todo), Admin (gestión miembros + apps), Developer (sandbox + catálogo + dashboard), Viewer (solo lectura catálogo + dashboard)
    - Middleware `authorize()` que valida rol contra acción solicitada
    - Proteger todas las rutas según la matriz
    - _Requirements: 7.6, 15.2, 15.3_

  - [ ]* 3.4 Write property test para RBAC
    - **Property 35: RBAC Enforcement** — Solo Owner/Admin pueden crear apps, regenerar keys, invitar; solo Owner puede transferir ownership, eliminar org, cambiar rol de Admin; otros roles reciben 403
    - **Validates: Requirements 15.3, 7.6**

- [ ] 4. Registro y Onboarding de Aliados
  - [ ] 4.1 Implementar backend del wizard de onboarding
    - POST `/api/v1/onboarding/register` — Paso 1: validar datos empresa (razón social, NIT, tipo, representante, correo, teléfono), validar formato NIT (9 dígitos + dígito verificación), verificar NIT no duplicado
    - POST `/api/v1/onboarding/verify-email` — Paso 2: verificar token de correo (simulado para hackathon, marcar como verificado directamente)
    - POST `/api/v1/onboarding/create-account` — Paso 3: crear cuenta Owner con contraseña hasheada, registrar Consent_Records (términos, habeas_data, data_usage)
    - POST `/api/v1/onboarding/create-app` — Paso 4: crear primera Aplicación, generar API Key + Client ID + Client Secret (mostrar una sola vez)
    - GET `/api/v1/onboarding/summary` — Paso 5: retornar resumen de configuración completada
    - Validar límite de 5 aplicaciones por organización
    - Organizaciones de alto riesgo (SARLAFT) se crean en estado `pending_approval`
    - _Requirements: 1.1-1.11, 1.13, 1.16_

  - [ ]* 4.2 Write property tests para onboarding
    - **Property 1: NIT Validation** — Validar que solo NITs con 9 dígitos + dígito de verificación correcto son aceptados
    - **Validates: Requirements 1.2**
    - **Property 2: Credential Uniqueness** — API Keys, Client IDs y Client Secrets generados son siempre distintos entre sí
    - **Validates: Requirements 1.10, 1.12**
    - **Property 3: Application Limit Per Organization** — Organizaciones con >= 5 apps no pueden crear más
    - **Validates: Requirements 1.13**
    - **Property 4: High-Risk Organization Status** — Empresas de alto riesgo se crean con status `pending_approval`
    - **Validates: Requirements 1.16**

  - [ ] 4.3 Implementar frontend del Wizard de Onboarding
    - Crear componentes: `OnboardingWizard`, `StepCompanyInfo`, `StepEmailVerification`, `StepAccountCreation`, `StepFirstApp`, `StepSummary`
    - Indicador de progreso visual (pasos 1-5)
    - Validación de formularios con Zod en cada paso
    - Validación de NIT en tiempo real (formato + dígito verificación)
    - Indicador de fortaleza de contraseña en tiempo real
    - Checkboxes separados para términos, Habeas Data y política de datos
    - Mostrar credenciales generadas con botón copiar y opción descargar como archivo de configuración
    - Paso 5: resumen con enlaces a Catálogo, Sandbox y documentación
    - _Requirements: 1.1, 1.7, 1.8, 1.9, 1.10, 1.11, 10.13, 16.1_

- [ ] 5. Checkpoint - Verificar auth y onboarding
  - Verificar flujo completo: registro → verificación → cuenta → app → resumen
  - Verificar que JWT se emite correctamente y las rutas protegidas funcionan
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Catálogo de APIs con documentación interactiva
  - [ ] 6.1 Implementar backend del catálogo
    - GET `/api/v1/catalog` — Listar APIs con filtros (categoría, versión, estado) y búsqueda full-text (PostgreSQL GIN index)
    - GET `/api/v1/catalog/:id` — Detalle de API con especificación OpenAPI
    - Parsear especificaciones OpenAPI 3.x con `swagger-parser` (validación + dereferencing)
    - Generar fragmentos de código desde OpenAPI spec para JavaScript (fetch), Python (requests) y cURL
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.3_

  - [ ]* 6.2 Write property tests para catálogo
    - **Property 5: Catalog Filtering Correctness** — Todas las APIs retornadas cumplen todos los filtros aplicados; ninguna API que cumpla es excluida
    - **Validates: Requirements 2.2, 7.5**
    - **Property 6: Search Returns Matching Results** — APIs con término en nombre/descripción/tags aparecen en resultados; las que no, no aparecen
    - **Validates: Requirements 2.5**
    - **Property 7: Code Snippet Generation From OpenAPI** — Snippets generados incluyen método HTTP, URL, headers y body correctos según schema OpenAPI
    - **Validates: Requirements 2.4, 5.1, 5.3**
    - **Property 34: OpenAPI Parse-Serialize Round-Trip** — Parsear y serializar una spec OpenAPI válida produce un objeto equivalente al original
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**

  - [ ] 6.3 Implementar frontend del catálogo
    - Crear componentes: `CatalogPage`, `ApiCard`, `ApiDetailPage`, `OpenApiRenderer`, `CodeSnippets`
    - Filtros por categoría (Cotización, Emisión, Pagos, Consulta, Identidad/SARLAFT), versión y estado (activa/deprecada)
    - Búsqueda por texto libre
    - Renderizado interactivo de OpenAPI: endpoints colapsables, tablas de parámetros, schemas request/response
    - Selector de lenguaje (JavaScript, Python, cURL) con botón copiar código
    - Indicadores visuales de estado de API (activa=verde, deprecada=amarillo, retirada=rojo)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.4_

- [ ] 7. Sandbox de pruebas interactivo
  - [ ] 7.1 Implementar backend del sandbox
    - POST `/api/v1/sandbox/execute` — Ejecutar solicitud de prueba: validar request contra schema OpenAPI, generar response mock realista, registrar en historial
    - GET `/api/v1/sandbox/history` — Historial de solicitudes del aliado con timestamp, endpoint, request y response
    - Validación de schema con Zod generado dinámicamente desde OpenAPI spec
    - Rate limiting: 100 solicitudes por hora por Aplicación en sandbox
    - Generar datos de prueba realistas (sin datos reales de producción)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 7.2 Write property tests para sandbox
    - **Property 8: Sandbox Form Generation From OpenAPI** — Formulario generado contiene campos para cada parámetro requerido del schema con tipos y labels correctos
    - **Validates: Requirements 3.1**
    - **Property 9: Schema Validation Rejects Invalid Requests** — Payloads inválidos son rechazados con errores específicos por campo; payloads válidos son aceptados
    - **Validates: Requirements 3.5**
    - **Property 10: Rate Limiting Enforcement** — Primeras N solicitudes permitidas, solicitud N+1 rechazada con 429
    - **Validates: Requirements 3.6, 10.16**

  - [ ] 7.3 Implementar frontend del sandbox
    - Crear componentes: `SandboxPage`, `RequestForm`, `ResponseViewer`, `RequestHistory`
    - Formulario dinámico generado desde OpenAPI spec: campos por parámetro (path, query, header, body) con tipos correctos
    - Visualización de response: status code con color, headers, body con syntax highlighting JSON
    - Historial de solicitudes con opción de replay
    - Errores de validación inline por campo
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ] 8. Checkpoint - Verificar catálogo y sandbox
  - Verificar que el catálogo muestra APIs con filtros y búsqueda funcionando
  - Verificar que el sandbox ejecuta solicitudes y muestra responses
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Dashboard de consumo
  - [ ] 9.1 Implementar backend del dashboard
    - GET `/api/v1/dashboard/metrics` — Métricas agregadas: total llamadas, tasa éxito, tasa error, latencia promedio, agrupadas por Aplicación
    - GET `/api/v1/dashboard/metrics?from=&to=` — Métricas por rango de fechas con granularidad por hora (24h) y por día (30d)
    - GET `/api/v1/dashboard/breakdown/:appId` — Desglose por API: conteo, tasa error, latencia por endpoint
    - GET `/api/v1/dashboard/quota/:appId` — Estado de cuota: quota_used, quota_limit, porcentaje, alerta si > 80%
    - Calcular métricas desde `audit_logs`: total = count, success_rate = count(2xx)/total, error_rate = count(4xx+5xx)/total, avg_latency = mean(response_time_ms)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 9.2 Write property tests para dashboard
    - **Property 11: Metrics Aggregation Correctness** — total_calls = count de entries; success_rate = 2xx/total; error_rate = 4xx+5xx/total; avg_latency = mean(response_time_ms); buckets por hora/día solo incluyen entries del rango
    - **Validates: Requirements 4.1, 4.2, 4.4, 4.5**
    - **Property 12: Quota Alert Threshold** — Apps con quota_used/quota_limit > 0.8 incluyen alert flag; las demás no
    - **Validates: Requirements 4.3**

  - [ ] 9.3 Implementar frontend del dashboard
    - Crear componentes: `DashboardPage`, `QuotaAlert`, `UsageChart`, `AppBreakdown`, `DateRangePicker`
    - Métricas principales: total llamadas, tasa éxito (%), tasa error (%), latencia promedio (ms)
    - Gráficos de tendencia con Recharts: por hora (últimas 24h), por día (últimos 30d)
    - Selector de rango de fechas con actualización en menos de 2 segundos
    - Alerta visual cuando consumo > 80% de cuota (banner amarillo/rojo)
    - Desglose por Aplicación y por endpoint al hacer clic
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 10. Panel de administración
  - [ ] 10.1 Implementar backend del panel admin
    - GET `/api/v1/admin/allies` — Listar aliados con filtros (nombre, NIT, correo, estado) y búsqueda en menos de 1 segundo
    - PATCH `/api/v1/admin/allies/:id/suspend` — Suspender aliado: cambiar estado, revocar todas las API Keys, registrar en audit_log
    - PATCH `/api/v1/admin/allies/:id/approve` — Aprobar aliado pendiente: cambiar estado a activo
    - PATCH `/api/v1/admin/allies/:id/reject` — Rechazar aliado: cambiar estado, registrar motivo
    - PATCH `/api/v1/admin/apps/:id/quota` — Modificar cuota de aplicación
    - PATCH `/api/v1/admin/apps/:id/revoke-key` — Revocar API Key: invalidar actual, generar nueva, notificar aliado
    - GET `/api/v1/admin/audit` — Registros de auditoría con filtros (aliado, API, fechas, status code), paginados (max 100/página)
    - GET `/api/v1/admin/audit/export` — Exportar auditoría como CSV
    - Todas las rutas admin protegidas con `authorize(['admin'])`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4_

  - [ ]* 10.2 Write property tests para admin
    - **Property 15: Ally Suspension Cascade** — Al suspender org: status cambia a suspended, todas las API Keys se invalidan, audit log se crea
    - **Validates: Requirements 7.2**
    - **Property 16: API Key Revocation** — Key revocada: requests con esa key reciben 403, nueva key generada, audit log creado
    - **Validates: Requirements 7.3, 10.15, 10.18**
    - **Property 17: Audit Log Completeness** — Cada API call y evento de seguridad genera audit log con correlation_id, timestamp, user_id, org_id, action, endpoint, method, ip, status_code, response_time_ms
    - **Validates: Requirements 8.1, 10.20, 15.13**
    - **Property 18: Audit Pagination** — Cada página tiene max 100 registros y cumple todos los filtros aplicados
    - **Validates: Requirements 8.2**

  - [ ] 10.3 Implementar frontend del panel admin
    - Crear componentes: `AdminDashboard`, `AllyList`, `AllyDetail`, `AuditLogViewer`
    - Tabla de aliados con columnas: empresa, NIT, estado, num apps, fecha registro
    - Filtros y búsqueda por nombre, NIT, correo
    - Acciones: suspender, aprobar, rechazar aliado; modificar cuota; revocar API Key
    - Visor de auditoría con filtros por aliado, API, fechas, status code
    - Botón exportar CSV
    - Acceso restringido a usuarios con rol Administrador
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.2, 8.4_

- [ ] 11. Checkpoint - Verificar dashboard y admin
  - Verificar que el dashboard muestra métricas y gráficos correctamente
  - Verificar que el panel admin permite gestionar aliados y ver auditoría
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Integración final y wiring
  - [ ] 12.1 Conectar navegación y layout principal
    - Crear layout principal con sidebar/navbar: Catálogo, Sandbox, Dashboard, Mis Apps, Equipo, Admin (condicional por rol)
    - Implementar React Router con rutas protegidas por autenticación y rol
    - Implementar API Client con interceptor para refresh automático de JWT
    - Página de login con formulario de correo + contraseña
    - Redirect a onboarding para usuarios nuevos, a catálogo para usuarios existentes
    - _Requirements: 10.5, 15.2_

  - [ ] 12.2 Implementar gestión de aplicaciones del aliado
    - GET `/api/v1/apps` — Listar aplicaciones de la organización con nombre, fecha, estado, uso del mes
    - POST `/api/v1/apps` — Crear aplicación (validar límite de 5)
    - POST `/api/v1/apps/:id/regenerate-key` — Regenerar API Key (requiere confirmación)
    - Crear página Mis Aplicaciones en frontend con listado y acciones
    - _Requirements: 1.12, 1.13, 1.14, 10.15_

  - [ ] 12.3 Implementar gestión de equipo básica
    - GET `/api/v1/team/members` — Listar miembros de la organización
    - POST `/api/v1/team/invite` — Enviar invitación (simular envío de correo para hackathon)
    - POST `/api/v1/team/invite/:token/accept` — Aceptar invitación
    - PATCH `/api/v1/team/members/:id/role` — Cambiar rol (solo Owner)
    - DELETE `/api/v1/team/members/:id` — Eliminar miembro
    - Validar que Owner no puede eliminarse sin transferir propiedad
    - Crear página Equipo en frontend con listado de miembros e invitaciones
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.9, 15.10, 15.11, 15.12_

  - [ ]* 12.4 Write property tests para equipo e invitaciones
    - **Property 36: Invitation Token Validity** — Token aceptado solo si: no usado, menor a 72h, email no registrado en otra org; usuario creado con rol correcto
    - **Validates: Requirements 15.4, 15.5, 15.7**
    - **Property 37: Owner Self-Deletion Prevention** — Owner no puede eliminarse si no hay otro Admin para recibir ownership
    - **Validates: Requirements 15.12**

- [ ] 13. Datos demo y pulido para presentación
  - [ ] 13.1 Crear datos de demostración completos
    - Seed con 3 organizaciones aliadas de ejemplo (fintech, e-commerce, marketplace) con usuarios y aplicaciones
    - 5+ APIs de ejemplo con especificaciones OpenAPI completas: Cotización Auto, Emisión Póliza, Consulta Póliza, Pagos, Identidad/SARLAFT
    - Datos de consumo simulados en audit_logs para que el dashboard muestre gráficos realistas
    - Datos de cuota variados: una app al 90% (alerta), una al 50% (normal), una al 100% (bloqueada)
    - _Requirements: 2.1, 3.3, 4.1_

  - [ ] 13.2 Pulir UI y experiencia de demo
    - Verificar responsive en desktop (1280px+)
    - Verificar que todos los flujos principales funcionan end-to-end sin errores de consola
    - Agregar loading states y empty states en todas las páginas
    - Verificar que los indicadores visuales de estado de API son claros (activa/deprecada)
    - _Requirements: UX general_

- [ ] 14. Final checkpoint - Verificar prototipo completo
  - Ejecutar flujo completo de demo: registro, onboarding, catálogo, sandbox, dashboard, admin
  - Verificar que todos los endpoints responden correctamente
  - Ensure all tests pass, ask the user if questions arise.

## Tareas Opcionales (No MVP)

Las siguientes funcionalidades están diseñadas pero NO son necesarias para la demo de hackathon:

- [ ]* 15. Adaptador Legacy SOAP/XML
  - Implementar traducción bidireccional JSON a SOAP/XML
  - Property 31: Legacy Adapter Round-Trip
  - Property 32: SOAP Fault Translation
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ]* 16. Circuit Breaker completo
  - Implementar con `opossum`: CLOSED, OPEN (3 errores), HALF-OPEN (probe cada 30s), CLOSED
  - Property 29: Circuit Breaker State Machine
  - _Requirements: 11.1, 11.2_

- [ ]* 17. Endpoint MCP para agentes de IA
  - GET `/api/v1/mcp/tools` en formato Model Context Protocol
  - Enriquecer specs con `x-agent-hints` y `x-category`
  - Property 33: MCP Metadata Completeness
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ]* 18. Notificaciones por correo
  - Integración SMTP para verificación de correo, magic links, notificaciones de ciclo de vida
  - Property 13: Notification Targeting
  - Property 14: Deprecation Notice Timing
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 19. Consent Management completo
  - Gestión de consentimientos con versionamiento, re-aceptación y revocación
  - Property 38: Consent Record Completeness
  - Property 39: Consent Version Update Flow
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [ ]* 20. Rate limiting avanzado de autenticación
  - Escalamiento por IP: 5 intentos CAPTCHA, 10 delay, 20 bloqueo 15min
  - Property 27: Auth Rate Limiting Escalation
  - _Requirements: 10.17_

- [ ]* 21. Gobierno de versiones de APIs
  - Publicación de nuevas versiones, planes de retiro, deprecación
  - Property 20: Retired API Rejection
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 22. Magic Links y autenticación progresiva
  - Login sin contraseña vía magic link (15min, un solo uso)
  - Niveles de autenticación: L1 (lectura), L2 (sandbox/dashboard), L3 (ops sensibles + MFA)
  - Property 24: Progressive Authentication Enforcement
  - Property 25: Magic Link Validity
  - _Requirements: 10.7, 10.8, 10.9, 10.10_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each bloque funcional
- Property tests validate universal correctness properties from the design document using fast-check + Vitest
- Unit tests validate specific examples and edge cases
- Para la hackathon: priorizar flujos demostrables end-to-end sobre completitud de features secundarias
- Envío de correos simulado (log en consola) para la demo, no requiere SMTP real
