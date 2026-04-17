export interface Organization {
  id: string;
  name: string;
  nit: string;
  companyType: string;
  status: 'active' | 'pending_approval' | 'suspended' | 'rejected';
  appsCount: number;
  createdAt: string;
}

export interface ApiDefinition {
  id: string;
  name: string;
  description: string;
  category: 'Cotización' | 'Emisión' | 'Pagos' | 'Consulta' | 'Identidad/SARLAFT' | 'Modificaciones' | 'Renovaciones';
  currentVersion: string;
  status: 'active' | 'deprecated' | 'retired';
  tags: string[];
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  parameters?: EndpointParam[];
  requestBody?: Record<string, unknown>;
  responseExample?: Record<string, unknown>;
}

export interface EndpointParam {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  type: string;
  description: string;
}

export interface DashboardMetrics {
  totalCalls: number;
  successRate: number;
  errorRate: number;
  avgLatency: number;
  quotaUsed: number;
  quotaLimit: number;
}

export interface HourlyUsage {
  hour: string;
  calls: number;
  errors: number;
}

export interface AuditEntry {
  id: string;
  correlationId: string;
  action: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string;
  createdAt: string;
  organizationName: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  integrationModel: string;
  status: 'active' | 'suspended';
  quotaUsed: number;
  quotaLimit: number;
  createdAt: string;
}
