# Requirements Document — Conecta 2.0 API Ecosystem

## Introduction

Conecta 2.0 transforma el portal actual de APIs de Seguros Bolívar de un repositorio estático en un ecosistema de autoservicio de grado empresarial. La plataforma centraliza, expone y gobierna el consumo de activos digitales para terceros (aliados, intermediarios, fintechs, e-commerce, marketplaces, bancos), permitiendo integrar soluciones de seguros en tiempo real bajo el paradigma de Open Insurance.

El alcance del prototipo funcional (hackathon de 1 día) se centra en las capacidades demostrables: onboarding de aliados, catálogo de APIs, sandbox de pruebas, dashboard de consumo, y panel de administración. La arquitectura sigue el stack aprobado: React 18 + Vite + TypeScript + Tailwind + Shadcn UI en frontend, Node.js 20 + Express 4 en backend, PostgreSQL 15.4+ como persistencia.

**Competidores de referencia (dignos rivales):**
- **Zurich Exchange** — Marketplace de APIs empresariales con stores separados, catálogo filtrable, Knowledge Hub y 30+ APIs globales.
- **Chubb Studio Connect** — Portal B2B2C developer con APIs RESTful del ciclo de vida completo del seguro, sandbox, OAuth, dashboards por tenant, operando en 54 países.

**Modelos de integración soportados:**
1. Distribución Tradicional — Seguro en canales propios de Bolívar.
2. Marca Blanca — Bolívar entrega front completo, aliado integra APIs.
3. Seguro Embebido (Insurance-as-a-Service) — Seguro integrado en el aliado con flujos de Cotización, Emisión, Pagos, Identidad/SARLAFT, Modificaciones, Renovaciones, Consulta de póliza.

**Contexto regulatorio:** Habeas Data (Colombia), SARLAFT (prevención lavado de activos), Open Insurance 2025.

## Glossary

- **Portal**: La aplicación web Conecta 2.0 que expone el catálogo de APIs, onboarding, sandbox y dashboards.
- **Aliado**: Entidad externa (intermediario, fintech, e-commerce, banco, marketplace) que consume APIs de Seguros Bolívar a través del Portal.
- **Organización_Aliada**: Entidad jurídica registrada en el Portal que agrupa usuarios, Aplicaciones y credenciales bajo un mismo NIT y razón social.
- **Usuario_Aliado**: Persona natural con cuenta individual dentro de una Organización_Aliada, con credenciales propias y rol asignado.
- **Rol_Aliado**: Nivel de permisos asignado a un Usuario_Aliado dentro de su Organización_Aliada. Valores posibles: Owner, Admin, Developer, Viewer.
- **Owner**: Rol_Aliado del usuario que registró la Organización_Aliada. Tiene permisos completos incluyendo transferencia de propiedad y eliminación de la organización.
- **Administrador**: Usuario interno de Seguros Bolívar con permisos para gestionar aliados, APIs y configuraciones del Portal.
- **Aplicación**: Registro creado por un Aliado dentro del Portal que agrupa credenciales (API Key, Client ID/Secret) para consumir APIs.
- **API_Key**: Credencial única generada por el Portal para autenticar las solicitudes de una Aplicación.
- **Catálogo**: Sección del Portal que lista todas las APIs disponibles con documentación, especificaciones OpenAPI y ejemplos.
- **Sandbox**: Ambiente aislado de pruebas donde los Aliados ejecutan llamadas a APIs sin afectar datos de producción.
- **Dashboard_Consumo**: Panel visual que muestra métricas de uso de APIs por Aliado y Aplicación (llamadas, errores, latencia, cuota).
- **Especificación_OpenAPI**: Documento en formato OpenAPI 3.x que describe endpoints, schemas, autenticación y ejemplos de una API.
- **Cuota**: Límite máximo de llamadas a APIs permitidas por Aplicación en un período de tiempo definido.
- **Versión_API**: Identificador semántico (v1, v2) que distingue versiones de una misma API publicada en el Catálogo.
- **Plan_Retiro**: Proceso de deprecación de una Versión_API que incluye notificación, período de gracia y desactivación.
- **Registro_Auditoría**: Entrada inmutable que documenta quién consumió qué API, cuándo y con qué resultado.
- **Circuit_Breaker**: Mecanismo que detiene automáticamente el tráfico hacia un servicio backend cuando detecta fallas consecutivas.
- **Adaptador_Legacy**: Componente que traduce solicitudes REST/JSON del Portal a SOAP/XML de sistemas legados de Seguros Bolívar.
- **Correlation_ID**: Identificador único propagado en cada solicitud entre capas para trazabilidad end-to-end.
- **Parser**: Componente que transforma una Especificación_OpenAPI en texto (JSON/YAML) a un objeto estructurado en memoria.
- **Serializer**: Componente que transforma un objeto de Especificación_OpenAPI estructurado de vuelta a formato texto (JSON).
- **Wizard_Onboarding**: Flujo guiado paso a paso con indicadores de progreso que conduce al Usuario_Aliado a través del registro de la Organización_Aliada y la configuración inicial.
- **Magic_Link**: Enlace de autenticación de un solo uso enviado por correo electrónico que permite al Usuario_Aliado iniciar sesión sin contraseña, con expiración de 15 minutos.
- **Refresh_Token**: Token de larga vida almacenado en httpOnly cookie que permite obtener nuevos Access Tokens sin re-autenticación.
- **Access_Token**: JWT de corta vida (15 minutos) que autoriza solicitudes a APIs protegidas del Portal.
- **Autenticación_Progresiva**: Esquema de seguridad escalonado donde el nivel de verificación aumenta según la sensibilidad de la operación (lectura → escritura → operaciones críticas).
- **Consent_Record**: Registro auditable de la aceptación explícita de términos, Habeas Data y políticas de uso de datos por parte de un Usuario_Aliado.
- **Invitación**: Solicitud enviada por un Owner o Admin de una Organización_Aliada a un correo electrónico para unirse como Usuario_Aliado con un Rol_Aliado específico.
- **NIT**: Número de Identificación Tributaria, identificador fiscal único de personas jurídicas en Colombia.

## Requirements

### Requirement 1: Registro y Onboarding de Aliados

**User Story:** Como Aliado, quiero registrar mi organización y crear usuarios en el Portal mediante un flujo guiado paso a paso, para integrar APIs de seguros sin depender de procesos manuales.

#### Acceptance Criteria

**Paso 1 — Registro de la Organización_Aliada:**

1. WHEN un Usuario_Aliado accede al formulario de registro, THE Wizard_Onboarding SHALL presentar el paso 1 de 5 solicitando: razón social, NIT, tipo de empresa (fintech, e-commerce, banco, marketplace, intermediario, otro), nombre del representante legal, correo corporativo y teléfono de contacto.
2. WHEN un Usuario_Aliado envía los datos empresariales del paso 1, THE Portal SHALL validar el formato del NIT (9 dígitos + dígito de verificación) y verificar que el NIT no esté registrado previamente en el sistema.
3. IF el NIT proporcionado ya está registrado en el Portal, THEN THE Portal SHALL informar que la organización ya existe y ofrecer la opción de solicitar acceso como Usuario_Aliado adicional a la Organización_Aliada existente.

**Paso 2 — Verificación de correo corporativo:**

4. WHEN el Portal acepta los datos empresariales, THE Portal SHALL enviar un correo de verificación al correo corporativo proporcionado con un enlace de un solo uso válido por 24 horas.
5. WHEN el Usuario_Aliado confirma su correo mediante el enlace de verificación, THE Portal SHALL marcar el correo como verificado y avanzar al paso 3 del Wizard_Onboarding.
6. IF el enlace de verificación ha expirado o ya fue utilizado, THEN THE Portal SHALL mostrar un mensaje indicando la expiración y ofrecer la opción de reenviar un nuevo enlace de verificación.

**Paso 3 — Creación de cuenta del Owner:**

7. WHEN el correo está verificado, THE Wizard_Onboarding SHALL presentar el paso 3 solicitando al Usuario_Aliado crear su cuenta personal: nombre completo, cargo, contraseña y aceptación de términos de uso, política de Habeas Data y política de tratamiento de datos.
8. WHEN el Usuario_Aliado completa la creación de cuenta, THE Portal SHALL crear la Organización_Aliada en estado "activa", asignar al Usuario_Aliado el Rol_Aliado "Owner" y registrar un Consent_Record con la aceptación de términos y Habeas Data.

**Paso 4 — Creación de primera Aplicación:**

9. WHEN la cuenta del Owner está creada, THE Wizard_Onboarding SHALL presentar el paso 4 solicitando crear la primera Aplicación con nombre, descripción y modelo de integración (Distribución Tradicional, Marca Blanca, Seguro Embebido).
10. WHEN el Owner completa la creación de la Aplicación, THE Portal SHALL generar una API_Key única, un Client ID y un Client Secret, y mostrarlos al Owner una única vez con opción de copiar y descargar como archivo de configuración.

**Paso 5 — Resumen y próximos pasos:**

11. WHEN la primera Aplicación está creada, THE Wizard_Onboarding SHALL presentar el paso 5 con un resumen de la configuración completada, enlaces al Catálogo, al Sandbox y a la documentación de inicio rápido.

**Gestión de Aplicaciones:**

12. WHEN un Usuario_Aliado con Rol_Aliado Owner o Admin solicita crear una Aplicación proporcionando nombre y descripción, THE Portal SHALL generar una API_Key única, un Client ID y un Client Secret, y mostrarlos al Usuario_Aliado una única vez.
13. IF una Organización_Aliada intenta crear más de 5 Aplicaciones, THEN THE Portal SHALL rechazar la solicitud e indicar que se ha alcanzado el límite máximo de Aplicaciones por Organización_Aliada.
14. WHEN un Usuario_Aliado autenticado accede a la sección "Mis Aplicaciones", THE Portal SHALL listar todas las Aplicaciones de la Organización_Aliada con nombre, fecha de creación, estado (activa/suspendida) y uso acumulado del mes.
15. IF un Usuario_Aliado intenta registrarse con un correo que ya existe en el sistema, THEN THE Portal SHALL mostrar un mensaje indicando que el correo ya está registrado y ofrecer la opción de recuperar contraseña o solicitar un Magic_Link.

**Aprobación para aliados de alto riesgo:**

16. WHERE un Administrador ha configurado la categoría de empresa del Aliado como "alto riesgo" (según políticas SARLAFT), THE Portal SHALL crear la Organización_Aliada en estado "pendiente_aprobación" en lugar de "activa" y notificar al Administrador para revisión manual.
17. WHEN un Administrador aprueba una Organización_Aliada en estado "pendiente_aprobación", THE Portal SHALL cambiar el estado a "activa", notificar al Owner por correo y permitir el acceso completo al Portal.
18. IF un Administrador rechaza una Organización_Aliada en estado "pendiente_aprobación", THEN THE Portal SHALL cambiar el estado a "rechazada", notificar al Owner por correo con el motivo del rechazo y mantener los datos por 90 días antes de eliminarlos.

### Requirement 2: Catálogo de APIs con Documentación Interactiva

**User Story:** Como Aliado, quiero explorar un catálogo de APIs con documentación detallada y ejemplos de código, para evaluar y seleccionar las APIs que necesito integrar.

#### Acceptance Criteria

1. THE Portal SHALL mostrar el Catálogo con todas las APIs publicadas, incluyendo nombre, descripción, categoría (Cotización, Emisión, Pagos, Consulta, Identidad/SARLAFT), versión actual y estado (activa/deprecada).
2. WHEN un Aliado aplica filtros por categoría, versión o estado en el Catálogo, THE Portal SHALL mostrar únicamente las APIs que coincidan con los criterios seleccionados en menos de 1 segundo.
3. WHEN un Aliado selecciona una API del Catálogo, THE Portal SHALL mostrar la Especificación_OpenAPI renderizada con endpoints, parámetros, schemas de request/response y códigos de error.
4. WHEN un Aliado visualiza la documentación de una API, THE Portal SHALL mostrar ejemplos de código funcionales en al menos 3 lenguajes: JavaScript, Python y cURL.
5. WHEN un Aliado busca por texto libre en el Catálogo, THE Portal SHALL retornar APIs cuyo nombre, descripción o tags coincidan con el término de búsqueda, ordenadas por relevancia.
6. THE Portal SHALL renderizar la Especificación_OpenAPI de cada API a partir de un documento OpenAPI 3.x válido almacenado en el sistema.

### Requirement 3: Sandbox de Pruebas

**User Story:** Como Aliado, quiero probar las APIs en un ambiente sandbox aislado, para validar mi integración antes de pasar a producción.

#### Acceptance Criteria

1. WHEN un Aliado autenticado accede a la sección Sandbox de una API, THE Portal SHALL mostrar un formulario interactivo con los campos del request pre-poblados según la Especificación_OpenAPI.
2. WHEN un Aliado envía una solicitud de prueba desde el Sandbox, THE Portal SHALL ejecutar la llamada contra el ambiente de pruebas y mostrar el response completo (status code, headers, body) en menos de 3 segundos.
3. THE Portal SHALL generar datos de prueba realistas para cada API del Sandbox sin utilizar datos reales de clientes o pólizas de producción.
4. WHEN un Aliado ejecuta una solicitud en el Sandbox, THE Portal SHALL registrar la solicitud en el historial de pruebas del Aliado con timestamp, endpoint, request y response.
5. IF una solicitud en el Sandbox contiene parámetros que no cumplen el schema definido en la Especificación_OpenAPI, THEN THE Portal SHALL rechazar la solicitud y mostrar los errores de validación específicos por campo.
6. WHILE un Aliado se encuentra en el Sandbox, THE Portal SHALL limitar las solicitudes a 100 por hora por Aplicación para proteger el ambiente de pruebas.

### Requirement 4: Dashboard de Consumo para Aliados

**User Story:** Como Aliado, quiero visualizar métricas de consumo de mis APIs en tiempo real, para monitorear mi integración y anticipar límites de cuota.

#### Acceptance Criteria

1. WHEN un Aliado autenticado accede al Dashboard_Consumo, THE Portal SHALL mostrar las métricas de las últimas 24 horas: total de llamadas, tasa de éxito, tasa de error y latencia promedio, agrupadas por Aplicación.
2. WHEN un Aliado selecciona un rango de fechas en el Dashboard_Consumo, THE Portal SHALL actualizar las métricas para reflejar el período seleccionado en menos de 2 segundos.
3. WHILE el consumo de una Aplicación supera el 80% de la Cuota asignada, THE Portal SHALL mostrar una alerta visual en el Dashboard_Consumo indicando la proximidad al límite.
4. WHEN un Aliado selecciona una Aplicación en el Dashboard_Consumo, THE Portal SHALL mostrar el desglose de llamadas por API, incluyendo conteo, tasa de error y latencia promedio por endpoint.
5. THE Portal SHALL mostrar gráficos de tendencia de consumo con granularidad por hora para las últimas 24 horas y por día para los últimos 30 días.
6. IF una Aplicación alcanza el 100% de la Cuota asignada, THEN THE Portal SHALL mostrar una notificación indicando que las llamadas adicionales serán rechazadas hasta el próximo período de facturación.

### Requirement 5: Generación de Fragmentos de Código y SDKs

**User Story:** Como Aliado, quiero obtener fragmentos de código listos para copiar y SDKs básicos, para acelerar la integración de APIs en mi aplicación.

#### Acceptance Criteria

1. WHEN un Aliado visualiza la documentación de una API, THE Portal SHALL generar fragmentos de código funcionales para cada endpoint en JavaScript (fetch/axios), Python (requests) y cURL.
2. WHEN un Aliado hace clic en "Copiar código" en un fragmento, THE Portal SHALL copiar el código al portapapeles del Aliado e incluir la API_Key del Aliado como placeholder configurable.
3. THE Portal SHALL generar los fragmentos de código a partir de la Especificación_OpenAPI de cada API, asegurando que los parámetros, headers y body coincidan con el schema definido.
4. WHEN un Aliado selecciona un lenguaje de programación en el selector de código, THE Portal SHALL actualizar todos los fragmentos de la página al lenguaje seleccionado.

### Requirement 6: Notificaciones de Ciclo de Vida de APIs

**User Story:** Como Aliado, quiero recibir notificaciones sobre cambios en las APIs que consumo, para planificar actualizaciones y evitar interrupciones.

#### Acceptance Criteria

1. WHEN un Administrador publica una nueva Versión_API, THE Portal SHALL enviar una notificación por correo y en el Portal a todos los Aliados que consumen la API afectada, indicando la nueva versión y los cambios relevantes.
2. WHEN un Administrador inicia un Plan_Retiro para una Versión_API, THE Portal SHALL notificar a los Aliados consumidores con al menos 90 días de antelación, indicando la fecha de desactivación y la versión de reemplazo.
3. WHEN un Administrador programa una ventana de mantenimiento, THE Portal SHALL notificar a todos los Aliados activos con al menos 48 horas de antelación, indicando fecha, hora de inicio, duración estimada y APIs afectadas.
4. WHEN un Aliado autenticado accede al centro de notificaciones, THE Portal SHALL listar todas las notificaciones ordenadas por fecha, con estado leída/no leída y filtros por tipo (nueva versión, deprecación, mantenimiento).

### Requirement 7: Gestión Centralizada de Aliados y Aplicaciones

**User Story:** Como Administrador, quiero gestionar aliados y sus aplicaciones desde un panel centralizado, para controlar el acceso a las APIs de forma granular.

#### Acceptance Criteria

1. WHEN un Administrador accede al panel de gestión, THE Portal SHALL listar todos los Aliados registrados con nombre de empresa, NIT, estado (activo/suspendido/pendiente), número de Aplicaciones y fecha de registro.
2. WHEN un Administrador selecciona un Aliado y ejecuta la acción "Suspender", THE Portal SHALL cambiar el estado del Aliado a "suspendido", revocar todas las API_Keys activas de sus Aplicaciones y registrar la acción en el Registro_Auditoría.
3. WHEN un Administrador selecciona una Aplicación y ejecuta la acción "Revocar API Key", THE Portal SHALL invalidar la API_Key actual, generar una nueva y notificar al Aliado propietario.
4. WHEN un Administrador modifica la Cuota de una Aplicación, THE Portal SHALL aplicar el nuevo límite de forma inmediata y registrar el cambio en el Registro_Auditoría.
5. WHEN un Administrador busca aliados por nombre, NIT o correo en el panel de gestión, THE Portal SHALL retornar los resultados coincidentes en menos de 1 segundo.
6. THE Portal SHALL restringir el acceso al panel de gestión exclusivamente a usuarios con rol "Administrador", validando el rol mediante JWT en cada solicitud.

### Requirement 8: Auditoría y Trazabilidad de Consumo

**User Story:** Como Administrador, quiero consultar registros detallados de consumo de APIs, para cumplir con requisitos de auditoría y regulación (Habeas Data, SARLAFT).

#### Acceptance Criteria

1. WHEN una Aplicación realiza una llamada a cualquier API, THE Portal SHALL crear un Registro_Auditoría inmutable con: Correlation_ID, timestamp, Aliado, Aplicación, endpoint, método HTTP, IP de origen, status code y tiempo de respuesta.
2. WHEN un Administrador consulta los registros de auditoría con filtros (Aliado, API, rango de fechas, status code), THE Portal SHALL retornar los registros coincidentes paginados con un máximo de 100 registros por página.
3. THE Portal SHALL retener los Registros_Auditoría por un mínimo de 90 días en almacenamiento activo, cumpliendo con la política de retención de datos de la organización.
4. WHEN un Administrador exporta registros de auditoría, THE Portal SHALL generar un archivo CSV con todos los campos del Registro_Auditoría para el rango de fechas seleccionado.
5. THE Portal SHALL propagar un Correlation_ID único en cada solicitud entre todas las capas del sistema (frontend, API Gateway, backend, base de datos) para trazabilidad end-to-end.

### Requirement 9: Gobierno de Versiones de APIs

**User Story:** Como Administrador, quiero publicar y gestionar versiones de APIs con planes de retiro, para evolucionar el catálogo sin interrumpir integraciones existentes.

#### Acceptance Criteria

1. WHEN un Administrador publica una nueva Versión_API proporcionando la Especificación_OpenAPI, notas de cambio y categoría, THE Portal SHALL agregar la versión al Catálogo y marcarla como "activa".
2. WHEN un Administrador inicia un Plan_Retiro para una Versión_API, THE Portal SHALL marcar la versión como "deprecada" en el Catálogo y mostrar un banner de advertencia en la documentación de la versión.
3. WHEN la fecha de desactivación de un Plan_Retiro se cumple, THE Portal SHALL cambiar el estado de la Versión_API a "retirada" y rechazar nuevas solicitudes a esa versión con status code 410 (Gone).
4. THE Portal SHALL mantener disponibles en el Catálogo todas las versiones de una API (activas, deprecadas y retiradas) con indicadores visuales claros de su estado.
5. WHEN un Administrador sube una Especificación_OpenAPI, THE Portal SHALL validar que el documento sea un OpenAPI 3.x válido antes de aceptar la publicación.

### Requirement 10: Seguridad y Autenticación B2B

**User Story:** Como Aliado, quiero que mis credenciales y comunicaciones estén protegidas con estándares de seguridad empresarial y flujos de autenticación amigables, para cumplir con los requisitos de mi organización sin fricción innecesaria.

#### Acceptance Criteria

**Autenticación y tokens:**

1. THE Portal SHALL autenticar todas las solicitudes a APIs protegidas mediante API_Key en el header `X-API-Key` o mediante token OAuth 2.0 en el header `Authorization: Bearer`.
2. IF una solicitud a una API protegida no incluye credenciales válidas, THEN THE Portal SHALL rechazar la solicitud con status code 401 (Unauthorized) sin revelar detalles internos del sistema.
3. THE Portal SHALL implementar OAuth 2.0 con flujo Authorization Code + PKCE para aplicaciones SPA del Portal, y flujo Client Credentials para integraciones servidor-a-servidor.
4. THE Portal SHALL emitir Access_Tokens como JWT con expiración de 15 minutos y Refresh_Tokens con expiración de 7 días, almacenando los Refresh_Tokens exclusivamente en httpOnly cookies con atributos Secure, SameSite=Strict y Path restringido al endpoint de refresh.
5. WHEN un Access_Token expira y el Usuario_Aliado tiene un Refresh_Token válido en la httpOnly cookie, THE Portal SHALL emitir un nuevo Access_Token de forma transparente sin requerir re-autenticación.
6. WHEN un Refresh_Token es utilizado, THE Portal SHALL invalidar el Refresh_Token anterior y emitir uno nuevo (rotación de refresh tokens) para prevenir reutilización.

**Autenticación progresiva y Magic Links:**

7. THE Portal SHALL implementar Autenticación_Progresiva con tres niveles: nivel 1 (correo verificado) para lectura de Catálogo y documentación, nivel 2 (contraseña o Magic_Link) para acceso al Sandbox y Dashboard_Consumo, nivel 3 (MFA) para operaciones sensibles (regenerar API_Keys, gestionar miembros del equipo, modificar configuración de la Organización_Aliada).
8. WHEN un Usuario_Aliado solicita iniciar sesión mediante Magic_Link, THE Portal SHALL enviar un enlace de autenticación de un solo uso al correo registrado del Usuario_Aliado, válido por 15 minutos.
9. IF un Magic_Link ha expirado, ya fue utilizado o no corresponde al correo del Usuario_Aliado, THEN THE Portal SHALL rechazar la autenticación y ofrecer la opción de solicitar un nuevo Magic_Link.
10. WHEN un Usuario_Aliado intenta realizar una operación de nivel 3 sin haber completado MFA en la sesión actual, THE Portal SHALL solicitar verificación MFA antes de ejecutar la operación, ofreciendo TOTP (aplicación autenticadora) o código por correo como métodos disponibles.

**Contraseñas y credenciales:**

11. THE Portal SHALL almacenar las contraseñas de los Usuarios_Aliados utilizando bcrypt con un factor de costo mínimo de 10.
12. THE Portal SHALL enforcar una política de contraseñas que requiera un mínimo de 12 caracteres sin restricciones arbitrarias de composición (mayúsculas, números, símbolos), y validar cada contraseña contra la lista de contraseñas comprometidas de HaveIBeenPwned mediante consulta k-anonymity (enviando solo los primeros 5 caracteres del hash SHA-1).
13. WHEN un Usuario_Aliado ingresa una contraseña en el formulario de registro o cambio de contraseña, THE Portal SHALL mostrar un indicador visual de fortaleza de contraseña en tiempo real con niveles: débil, aceptable, fuerte.
14. WHEN un Usuario_Aliado solicita restablecer su contraseña, THE Portal SHALL enviar un enlace de restablecimiento al correo registrado, válido por 1 hora y de un solo uso.
15. WHEN un Usuario_Aliado con Rol_Aliado Owner o Admin solicita regenerar una API_Key de una Aplicación, THE Portal SHALL requerir confirmación explícita mostrando el impacto (integraciones que dejarán de funcionar), generar la nueva API_Key, invalidar la anterior y registrar la acción en el Registro_Auditoría.

**Rate limiting inteligente:**

16. THE Portal SHALL aplicar rate limiting por API_Key con un máximo configurable de solicitudes por minuto, retornando status code 429 (Too Many Requests) cuando se exceda el límite.
17. THE Portal SHALL implementar rate limiting escalonado para intentos de autenticación fallidos por IP: después de 5 intentos fallidos en 5 minutos presentar CAPTCHA, después de 10 intentos fallidos aplicar un delay incremental de 2 segundos por intento, después de 20 intentos fallidos bloquear la IP por 15 minutos.
18. IF una API_Key es revocada o suspendida, THEN THE Portal SHALL rechazar todas las solicitudes que utilicen esa API_Key con status code 403 (Forbidden) de forma inmediata.

**Headers de seguridad y auditoría:**

19. THE Portal SHALL incluir los headers de seguridad HTTP en todas las respuestas: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security y Referrer-Policy.
20. THE Portal SHALL registrar todos los eventos de autenticación (login exitoso, login fallido, Magic_Link enviado, Magic_Link utilizado, refresh de token, revocación de API_Key, activación de MFA) en el Registro_Auditoría con timestamp, IP de origen y User-Agent.

**Alertas de sesión:**

21. WHEN un Usuario_Aliado inicia sesión desde un dispositivo o IP no reconocidos previamente, THE Portal SHALL enviar una notificación por correo al Usuario_Aliado indicando la nueva sesión con fecha, hora, IP y User-Agent, y ofrecer la opción de cerrar la sesión remotamente.
22. WHEN un Usuario_Aliado accede a la configuración de seguridad de su cuenta, THE Portal SHALL listar todas las sesiones activas con dispositivo, IP, ubicación aproximada y fecha de último acceso, permitiendo cerrar sesiones individuales o todas las sesiones excepto la actual.

### Requirement 11: Resiliencia y Observabilidad

**User Story:** Como Administrador, quiero que el Portal maneje fallas de servicios backend de forma resiliente y proporcione observabilidad completa, para garantizar disponibilidad y diagnóstico rápido.

#### Acceptance Criteria

1. WHEN un servicio backend responde con 3 errores consecutivos (status code 5xx), THE Portal SHALL activar el Circuit_Breaker para ese servicio, retornando status code 503 (Service Unavailable) a los Aliados con un mensaje descriptivo.
2. WHILE el Circuit_Breaker está activo para un servicio, THE Portal SHALL intentar una solicitud de prueba cada 30 segundos y reactivar el servicio cuando la solicitud de prueba sea exitosa.
3. THE Portal SHALL incluir un Correlation_ID único en el header `X-Correlation-ID` de cada respuesta HTTP para facilitar la trazabilidad.
4. THE Portal SHALL registrar logs estructurados en formato JSON con los campos: timestamp, level, service, correlation_id, method, path, status_code, duration_ms y message.
5. IF un endpoint del Portal responde con latencia superior a 5 segundos, THEN THE Portal SHALL registrar un log de nivel "warn" con los detalles de la solicitud para análisis de rendimiento.

### Requirement 12: Adaptador de Sistemas Legados

**User Story:** Como Administrador, quiero que el Portal traduzca solicitudes REST/JSON a SOAP/XML para sistemas legados, para exponer servicios existentes sin modificar los sistemas de origen.

#### Acceptance Criteria

1. WHEN un Aliado envía una solicitud REST/JSON a una API que conecta con un sistema legado, THE Adaptador_Legacy SHALL traducir la solicitud a formato SOAP/XML, enviarla al sistema legado y traducir la respuesta SOAP/XML de vuelta a REST/JSON.
2. THE Adaptador_Legacy SHALL validar el request JSON contra el schema OpenAPI antes de traducir a SOAP/XML.
3. IF el sistema legado retorna un error SOAP Fault, THEN THE Adaptador_Legacy SHALL traducir el error a un response JSON con status code HTTP apropiado (400 para errores de cliente, 502 para errores del legado) y un mensaje descriptivo.
4. THE Adaptador_Legacy SHALL completar la traducción bidireccional (JSON→SOAP→JSON) en menos de 50 milisegundos adicionales sobre la latencia del sistema legado.

### Requirement 13: Preparación para IA y Agent Experience (AX)

**User Story:** Como Aliado que utiliza agentes de IA, quiero que las APIs estén enriquecidas semánticamente y soporten protocolos de agentes, para que mis sistemas de IA puedan descubrir y consumir APIs de forma autónoma.

#### Acceptance Criteria

1. THE Portal SHALL enriquecer cada Especificación_OpenAPI con descripciones semánticas en los campos `summary`, `description` y `x-agent-hints` para cada endpoint, parámetro y schema.
2. THE Portal SHALL exponer un endpoint `/api/v1/mcp/tools` que retorne la lista de APIs disponibles en formato compatible con Model Context Protocol (MCP), incluyendo nombre, descripción, parámetros y schemas.
3. WHEN un agente de IA consulta el endpoint MCP, THE Portal SHALL retornar metadatos suficientes para que el agente invoque la API sin intervención humana, incluyendo ejemplos de request/response.
4. THE Portal SHALL incluir el campo `x-category` en cada Especificación_OpenAPI con la categoría de negocio (Cotización, Emisión, Pagos, Consulta, Identidad_SARLAFT, Modificaciones, Renovaciones).

### Requirement 14: Parsing y Renderizado de Especificaciones OpenAPI

**User Story:** Como desarrollador del Portal, quiero parsear y renderizar especificaciones OpenAPI de forma confiable, para que el catálogo y la documentación sean siempre consistentes con las definiciones de las APIs.

#### Acceptance Criteria

1. WHEN el Portal recibe una Especificación_OpenAPI en formato JSON o YAML, THE Parser SHALL transformarla en un objeto estructurado con endpoints, schemas, parámetros y ejemplos.
2. IF la Especificación_OpenAPI contiene errores de sintaxis o no cumple con el estándar OpenAPI 3.x, THEN THE Parser SHALL retornar un error descriptivo indicando la línea y el tipo de error.
3. THE Serializer SHALL formatear un objeto de Especificación_OpenAPI estructurado de vuelta a formato JSON válido preservando todos los campos y la estructura original.
4. FOR ALL Especificaciones_OpenAPI válidas, parsear y luego serializar SHALL producir un objeto equivalente al original (propiedad round-trip).
5. WHEN el Portal renderiza una Especificación_OpenAPI, THE Portal SHALL generar documentación HTML interactiva con secciones colapsables por endpoint, tablas de parámetros y bloques de código para request/response.

### Requirement 15: Gestión de Equipos de Aliados

**User Story:** Como Owner de una Organización_Aliada, quiero gestionar los miembros de mi equipo con roles diferenciados, para que cada persona tenga el nivel de acceso adecuado a las Aplicaciones y APIs compartidas.

#### Acceptance Criteria

**Estructura organizacional:**

1. THE Portal SHALL asociar cada Usuario_Aliado a exactamente una Organización_Aliada, compartiendo las Aplicaciones, API_Keys y configuraciones de la organización.
2. THE Portal SHALL soportar cuatro Roles_Aliado dentro de una Organización_Aliada: Owner (permisos completos), Admin (gestión de miembros y Aplicaciones), Developer (acceso al Sandbox, Catálogo y Dashboard_Consumo) y Viewer (acceso de solo lectura al Catálogo y Dashboard_Consumo).
3. THE Portal SHALL restringir las acciones de cada Usuario_Aliado según su Rol_Aliado: solo Owner y Admin pueden crear Aplicaciones, regenerar API_Keys e invitar miembros; solo Owner puede transferir propiedad, eliminar la Organización_Aliada o cambiar el rol de un Admin.

**Invitación de miembros:**

4. WHEN un Usuario_Aliado con Rol_Aliado Owner o Admin envía una Invitación proporcionando correo electrónico y Rol_Aliado deseado, THE Portal SHALL enviar un correo de Invitación con un enlace de un solo uso válido por 72 horas.
5. WHEN un usuario acepta una Invitación válida, THE Portal SHALL crear una cuenta de Usuario_Aliado vinculada a la Organización_Aliada con el Rol_Aliado especificado en la Invitación, solicitando nombre completo, cargo y contraseña.
6. IF una Invitación ha expirado o ya fue utilizada, THEN THE Portal SHALL mostrar un mensaje indicando la expiración y sugerir al usuario contactar al Owner o Admin de la Organización_Aliada para recibir una nueva Invitación.
7. IF el correo de la Invitación ya está registrado como Usuario_Aliado en otra Organización_Aliada, THEN THE Portal SHALL rechazar la Invitación e informar que el correo ya está asociado a otra organización.
8. WHEN un Owner o Admin accede a la sección "Invitaciones pendientes", THE Portal SHALL listar todas las Invitaciones enviadas con correo, Rol_Aliado asignado, fecha de envío, estado (pendiente/aceptada/expirada) y opción de reenviar o cancelar.

**Gestión de miembros:**

9. WHEN un Owner o Admin accede a la sección "Equipo" de la Organización_Aliada, THE Portal SHALL listar todos los Usuarios_Aliados con nombre, correo, Rol_Aliado, fecha de incorporación y fecha de último acceso.
10. WHEN un Owner cambia el Rol_Aliado de un Usuario_Aliado, THE Portal SHALL aplicar el nuevo rol de forma inmediata, notificar al Usuario_Aliado afectado por correo y registrar el cambio en el Registro_Auditoría.
11. WHEN un Owner o Admin elimina un Usuario_Aliado de la Organización_Aliada, THE Portal SHALL revocar el acceso del Usuario_Aliado de forma inmediata, invalidar todas sus sesiones activas y registrar la acción en el Registro_Auditoría.
12. IF el Owner intenta eliminar su propia cuenta sin transferir la propiedad a otro Usuario_Aliado con Rol_Aliado Admin, THEN THE Portal SHALL rechazar la operación e indicar que debe transferir la propiedad antes de abandonar la Organización_Aliada.

**Auditoría por usuario individual:**

13. THE Portal SHALL registrar en el Registro_Auditoría todas las acciones realizadas dentro de la Organización_Aliada con identificación del Usuario_Aliado individual que ejecutó la acción, incluyendo: creación de Aplicaciones, regeneración de API_Keys, invitación de miembros, cambios de rol y acceso al Sandbox.
14. WHEN un Owner o Admin consulta el registro de actividad de la Organización_Aliada, THE Portal SHALL mostrar un historial filtrable por Usuario_Aliado, tipo de acción y rango de fechas, paginado con un máximo de 50 registros por página.

### Requirement 16: Consent Management y Habeas Data

**User Story:** Como Usuario_Aliado, quiero gestionar mis consentimientos de forma transparente y auditable, para cumplir con la regulación colombiana de Habeas Data y tener control sobre el tratamiento de mis datos.

#### Acceptance Criteria

1. WHEN un Usuario_Aliado se registra en el Portal, THE Portal SHALL presentar de forma separada y explícita: términos y condiciones de uso, política de tratamiento de datos personales (Habeas Data) y política de uso de datos de consumo de APIs, requiriendo aceptación individual de cada una antes de completar el registro.
2. THE Portal SHALL crear un Consent_Record por cada aceptación, registrando: Usuario_Aliado, tipo de consentimiento, versión del documento aceptado, timestamp, IP de origen y hash del documento aceptado.
3. WHEN el Administrador publica una nueva versión de los términos, política de Habeas Data o política de uso de datos, THE Portal SHALL notificar a todos los Usuarios_Aliados activos y solicitar re-aceptación en el próximo inicio de sesión, bloqueando el acceso a funcionalidades hasta que el Usuario_Aliado acepte o rechace la nueva versión.
4. WHEN un Usuario_Aliado accede a la sección "Mis consentimientos", THE Portal SHALL listar todos los Consent_Records del Usuario_Aliado con tipo, versión, fecha de aceptación y opción de descargar el documento aceptado en formato PDF.
5. WHEN un Usuario_Aliado revoca un consentimiento de tratamiento de datos, THE Portal SHALL registrar la revocación en el Consent_Record, notificar al Administrador y restringir las funcionalidades que dependan del consentimiento revocado dentro de un plazo de 15 días hábiles conforme a la regulación colombiana.
6. THE Portal SHALL retener los Consent_Records por un mínimo de 10 años conforme a la regulación colombiana de Habeas Data, incluso después de la eliminación de la cuenta del Usuario_Aliado.
