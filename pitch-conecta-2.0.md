# Pitch: Conecta 2.0 — Portal de APIs de Seguros Bolívar

## Guión de Presentación (5 minutos)

---

### 🔴 MINUTO 1 — El Problema (0:00 - 1:00)

**Slide 1: "¿Cómo se integra hoy un aliado con Seguros Bolívar?"**

> "Imaginen que son una fintech colombiana y quieren ofrecer seguros embebidos en su app. Hoy, para integrar APIs de Seguros Bolívar, tienen que:
>
> 1. Entrar a conecta.segurosbolivar.com — una landing page estática
> 2. Escribir por WhatsApp o email para pedir acceso
> 3. Esperar días para recibir credenciales manualmente
> 4. No hay sandbox para probar antes de producción
> 5. No hay dashboard para monitorear el consumo
> 6. No hay documentación interactiva
>
> **El resultado: semanas para una integración que debería tomar horas.**
>
> Mientras tanto, Zurich Exchange ya ofrece 30+ APIs con catálogo filtrable, sandbox y analytics. Chubb Studio Connect opera en 54 países con onboarding autónomo.
>
> **Seguros Bolívar necesita dar el salto. Eso es Conecta 2.0.**"

---

### 🟢 MINUTO 2 — La Solución (1:00 - 2:00)

**Slide 2: "Conecta 2.0: De landing page a ecosistema de autoservicio"**

> "Conecta 2.0 transforma el portal actual en un ecosistema completo de Open Insurance. Un aliado puede:
>
> ✅ **Registrarse solo** — Onboarding autónomo con verificación de correo corporativo y NIT
>
> ✅ **Explorar el catálogo** — 7 categorías de APIs de seguros: Cotización, Emisión, Pagos, Consulta, Identidad/SARLAFT, Modificaciones, Renovaciones
>
> ✅ **Probar antes de producir** — Sandbox aislado con datos realistas y consola interactiva
>
> ✅ **Monitorear en tiempo real** — Dashboard de consumo con alertas de cuota
>
> ✅ **Copiar código y salir** — Snippets listos en JavaScript, Python y cURL
>
> **Todo sin una sola llamada telefónica, sin un solo correo manual.**"

**Slide 3: "Arquitectura"** *(mostrar diagrama Mermaid del design.md)*

> "La arquitectura es moderna y modular: React 18 + TypeScript en frontend, Node.js + Express en backend, PostgreSQL para persistencia. Cada servicio es independiente, lo que permite escalar por separado."

---

### 🔵 MINUTO 3 — Demo en Vivo (2:00 - 3:30)

**Flujo a demostrar (90 segundos):**

1. **Registro** → Formulario con nombre empresa, NIT, correo corporativo → cuenta creada
2. **Crear Aplicación** → Se generan API Key + Client ID + Client Secret (se muestran una sola vez)
3. **Catálogo** → Navegar APIs por categoría, buscar por texto, ver estados (activa/deprecada)
4. **Documentación** → Seleccionar una API → ver endpoints renderizados desde OpenAPI 3.x → snippets de código
5. **Sandbox** → Ejecutar una llamada de prueba → ver response en tiempo real con status, headers, body, latencia
6. **Dashboard** → Métricas de consumo, gráficos de tendencia, indicador de cuota

> "En menos de 5 minutos, un aliado pasó de no tener cuenta a estar probando APIs en sandbox. Eso es Conecta 2.0."

---

### 🟡 MINUTO 4 — Diferenciadores: Por Qué Ganamos (3:30 - 4:30)

**Slide 4: "Lo que nadie más tiene"**

> "Conecta 2.0 no solo iguala a Zurich y Chubb. Los supera en 3 áreas clave:"

#### Diferenciador 1: Adaptador de Sistemas Legados
> "Seguros Bolívar tiene sistemas core en SOAP/XML. En lugar de reescribirlos, nuestro Adaptador Legacy traduce REST/JSON a SOAP/XML de forma transparente. El aliado consume una API REST moderna; por debajo, el sistema legado sigue funcionando sin cambios. Overhead: menos de 50ms. **Ni Zurich ni Chubb resuelven esto.**"

#### Diferenciador 2: Preparación para IA (Agent Experience)
> "Conecta 2.0 es el primer portal de seguros en LATAM preparado para agentes de IA. Exponemos un endpoint compatible con Model Context Protocol (MCP) que permite a sistemas de IA descubrir y consumir APIs de forma autónoma. Cada API está enriquecida con metadatos semánticos (`x-agent-hints`, `x-category`). **Ningún competidor lo tiene.**"

#### Diferenciador 3: Regulación Colombiana Nativa
> "SARLAFT y Habeas Data no son un parche. Están integrados desde el diseño: auditoría inmutable con Correlation_ID, retención de 90 días, trazabilidad end-to-end. Los rivales globales no cubren regulación local. **Nosotros sí.**"

---

### 🏆 MINUTO 5 — Impacto y Cierre (4:30 - 5:00)

**Slide 5: "Impacto medible"**

| Métrica | Antes (Conecta actual) | Después (Conecta 2.0) |
|---|---|---|
| Tiempo de onboarding | Días/semanas (manual) | Minutos (autoservicio) |
| Intervención humana | 100% (WhatsApp/email) | 0% (self-service) |
| Pruebas pre-producción | No disponible | Sandbox aislado |
| Visibilidad de consumo | Ninguna | Dashboard en tiempo real |
| Soporte para IA | No existe | MCP endpoint nativo |
| Cumplimiento regulatorio | No evidente | SARLAFT + Habeas Data integrados |

**Slide 6: "Conecta 2.0 — Open Insurance para Colombia"**

> "Conecta 2.0 no es solo un portal de APIs. Es la plataforma que posiciona a Seguros Bolívar como líder de Open Insurance en Colombia.
>
> Construido con Kiro usando spec-driven development: 14 requisitos, diseño técnico completo, 23 tareas de implementación — todo trazable desde la especificación hasta el código.
>
> **De una landing page estática a un ecosistema de clase mundial. Eso es Conecta 2.0.**"

---

## Preguntas Frecuentes del Jurado (Preparación)

### "¿Cómo manejan la seguridad B2B?"
> Autenticación dual: API Key en header `X-API-Key` + OAuth 2.0 Bearer. Rate limiting configurable por API Key. Contraseñas con bcrypt. Headers de seguridad HTTP (CSP, HSTS, X-Frame-Options). Todos los eventos de autenticación se registran en audit log.

### "¿Qué pasa si un sistema legado se cae?"
> El Circuit Breaker se activa tras 3 errores consecutivos 5xx. Retorna 503 al aliado con mensaje descriptivo. Cada 30 segundos intenta una solicitud de prueba y reactiva el servicio automáticamente cuando responde bien.

### "¿Cómo cumplen con SARLAFT?"
> Cada llamada API genera un Registro de Auditoría inmutable con Correlation_ID, timestamp, aliado, aplicación, endpoint, IP de origen, status code y tiempo de respuesta. Retención mínima de 90 días. Exportable a CSV para auditorías.

### "¿Qué tan realista es implementar esto?"
> Usamos spec-driven development con Kiro. Los 14 requisitos se tradujeron en diseño técnico y 23 tareas modulares. El equipo trabaja en paralelo: backend core, servicios, frontend. El stack es estándar (React, Node, PostgreSQL) — no hay tecnología experimental.

### "¿Cómo se diferencia de Zurich Exchange?"
> Zurich es global y no cubre regulación colombiana. No tiene adaptador legacy ni soporte para IA/MCP. Conecta 2.0 está diseñado para el mercado colombiano con SARLAFT nativo, y es el primer portal de seguros en LATAM con Agent Experience.

### "¿Qué sigue después del hackathon?"
> El prototipo demuestra las capacidades core. El roadmap incluye: OAuth 2.0 completo, SDKs nativos (Node, Python, Java), marketplace de APIs de terceros, y expansión a más líneas de negocio de Seguros Bolívar.

---

## Tabla Comparativa para Slide

| Capacidad | Conecta Actual | Conecta 2.0 | Zurich Exchange | Chubb Studio |
|---|---|---|---|---|
| Onboarding autónomo | ❌ | ✅ | ✅ | ✅ |
| Catálogo filtrable | ❌ | ✅ 7 categorías | ✅ | ✅ |
| Documentación OpenAPI | ❌ | ✅ Interactiva | ✅ | ✅ |
| Sandbox de pruebas | ❌ | ✅ Aislado | ⚠️ Limitado | ✅ |
| Dashboard consumo | ❌ | ✅ Tiempo real | ✅ | ✅ |
| Gobierno versiones | ❌ | ✅ Plan_Retiro | ✅ | ✅ |
| Adaptador Legacy | ❌ | ✅ SOAP↔REST | ❌ | ❌ |
| IA / MCP | ❌ | ✅ Agent Experience | ❌ | ❌ |
| Regulación CO | ❌ | ✅ SARLAFT + Habeas Data | ❌ | ❌ |
| Circuit Breaker | ❌ | ✅ | ⚠️ Interno | ⚠️ Interno |
| Snippets de código | ❌ | ✅ JS/Python/cURL | ⚠️ Parcial | ✅ |
| Auditoría trazable | ❌ | ✅ Correlation_ID | ⚠️ Parcial | ⚠️ Parcial |
