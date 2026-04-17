import type { ApiDefinition } from '../types';
import { generateSnippet } from './code-generator';

export function generateApiDocMarkdown(api: ApiDefinition): string {
  let doc = `# ${api.name}\n\n`;
  doc += `> ${api.description}\n\n`;
  doc += `| Campo | Valor |\n|-------|-------|\n`;
  doc += `| Categoría | ${api.category} |\n`;
  doc += `| Versión | ${api.currentVersion} |\n`;
  doc += `| Estado | ${api.status} |\n`;
  doc += `| Tags | ${api.tags.join(', ')} |\n\n`;
  doc += `---\n\n`;
  doc += `## Endpoints\n\n`;

  api.endpoints.forEach((ep, i) => {
    doc += `### ${i + 1}. ${ep.method} \`${ep.path}\`\n\n`;
    doc += `**${ep.summary}**\n\n`;
    doc += `${ep.description}\n\n`;

    if (ep.parameters && ep.parameters.length > 0) {
      doc += `#### Parámetros\n\n`;
      doc += `| Nombre | Ubicación | Tipo | Requerido | Descripción |\n`;
      doc += `|--------|-----------|------|-----------|-------------|\n`;
      ep.parameters.forEach((p) => {
        doc += `| \`${p.name}\` | ${p.in} | ${p.type} | ${p.required ? 'Sí' : 'No'} | ${p.description} |\n`;
      });
      doc += `\n`;
    }

    if (ep.requestBody) {
      doc += `#### Request Body\n\n`;
      doc += `\`\`\`json\n${JSON.stringify(ep.requestBody, null, 2)}\n\`\`\`\n\n`;
    }

    if (ep.responseExample) {
      doc += `#### Ejemplo de Respuesta\n\n`;
      doc += `\`\`\`json\n${JSON.stringify(ep.responseExample, null, 2)}\n\`\`\`\n\n`;
    }

    doc += `#### Ejemplos de Código\n\n`;
    doc += `**JavaScript (fetch)**\n\n`;
    doc += `\`\`\`javascript\n${generateSnippet(ep, 'javascript')}\n\`\`\`\n\n`;
    doc += `**Python (requests)**\n\n`;
    doc += `\`\`\`python\n${generateSnippet(ep, 'python')}\n\`\`\`\n\n`;
    doc += `**cURL**\n\n`;
    doc += `\`\`\`bash\n${generateSnippet(ep, 'curl')}\n\`\`\`\n\n`;
    doc += `---\n\n`;
  });

  doc += `## Soporte\n\n`;
  doc += `- **Portal**: https://conecta.segurosbolivar.com\n`;
  doc += `- **Email**: soporte-apis@segurosbolivar.com\n`;
  doc += `- **Asistente IA**: Disponible 24/7 en el portal\n`;
  doc += `- **SLA**: Respuesta en menos de 24 horas hábiles\n\n`;
  doc += `## Autenticación\n\n`;
  doc += `Todas las solicitudes requieren autenticación mediante:\n\n`;
  doc += `- **API Key**: Header \`X-API-Key: YOUR_API_KEY\`\n`;
  doc += `- **OAuth 2.0**: Header \`Authorization: Bearer YOUR_TOKEN\`\n\n`;
  doc += `## Rate Limiting\n\n`;
  doc += `- Sandbox: 100 requests/hora por aplicación\n`;
  doc += `- Producción: Según cuota asignada (default 10,000/mes)\n`;
  doc += `- Respuesta 429 (Too Many Requests) al exceder el límite\n\n`;
  doc += `---\n\n`;
  doc += `*Documento generado desde Conecta 2.0 — Seguros Bolívar*\n`;
  doc += `*Fecha: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}*\n`;

  return doc;
}

export function generateApiDocJson(api: ApiDefinition): string {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: api.name,
      description: api.description,
      version: api.currentVersion,
      contact: { email: 'soporte-apis@segurosbolivar.com', name: 'Soporte Conecta 2.0' },
    },
    servers: [
      { url: 'https://sandbox.conecta.segurosbolivar.com', description: 'Sandbox' },
      { url: 'https://api.conecta.segurosbolivar.com', description: 'Producción' },
    ],
    paths: Object.fromEntries(
      api.endpoints.map((ep) => [
        ep.path,
        {
          [ep.method.toLowerCase()]: {
            summary: ep.summary,
            description: ep.description,
            parameters: ep.parameters?.map((p) => ({
              name: p.name, in: p.in, required: p.required, schema: { type: p.type }, description: p.description,
            })),
            ...(ep.requestBody ? { requestBody: { content: { 'application/json': { example: ep.requestBody } } } } : {}),
            responses: {
              '200': {
                description: 'Respuesta exitosa',
                content: { 'application/json': { example: ep.responseExample } },
              },
            },
          },
        },
      ])
    ),
    'x-category': api.category,
    'x-tags': api.tags,
  };
  return JSON.stringify(spec, null, 2);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
