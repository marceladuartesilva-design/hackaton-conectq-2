import type { ApiEndpoint } from '../types';

export function generateSnippet(endpoint: ApiEndpoint, lang: 'javascript' | 'python' | 'curl'): string {
  const baseUrl = 'https://api.conecta.segurosbolivar.com';
  const url = `${baseUrl}${endpoint.path}`;
  const hasBody = endpoint.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method);

  if (lang === 'curl') {
    let cmd = `curl -X ${endpoint.method} '${url}'`;
    cmd += ` \\\n  -H 'X-API-Key: YOUR_API_KEY'`;
    cmd += ` \\\n  -H 'Content-Type: application/json'`;
    if (hasBody) {
      cmd += ` \\\n  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'`;
    }
    return cmd;
  }

  if (lang === 'python') {
    let code = `import requests\n\n`;
    code += `url = "${url}"\n`;
    code += `headers = {\n    "X-API-Key": "YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\n`;
    if (hasBody) {
      code += `payload = ${JSON.stringify(endpoint.requestBody, null, 4)}\n\n`;
      code += `response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)\n`;
    } else {
      code += `\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)\n`;
    }
    code += `print(response.json())`;
    return code;
  }

  // javascript
  let code = `const response = await fetch('${url}', {\n`;
  code += `  method: '${endpoint.method}',\n`;
  code += `  headers: {\n    'X-API-Key': 'YOUR_API_KEY',\n    'Content-Type': 'application/json',\n  },\n`;
  if (hasBody) {
    code += `  body: JSON.stringify(${JSON.stringify(endpoint.requestBody, null, 4)}),\n`;
  }
  code += `});\n\nconst data = await response.json();\nconsole.log(data);`;
  return code;
}
