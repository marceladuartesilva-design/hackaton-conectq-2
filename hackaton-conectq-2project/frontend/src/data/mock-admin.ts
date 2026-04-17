import type { Organization, AuditEntry } from '../types';

export const mockOrganizations: Organization[] = [
  { id: '1', name: 'Rappi Colombia', nit: '901234567-1', companyType: 'e-commerce', status: 'active', appsCount: 3, createdAt: '2024-08-15' },
  { id: '2', name: 'Nequi S.A.', nit: '900876543-2', companyType: 'fintech', status: 'active', appsCount: 2, createdAt: '2024-09-01' },
  { id: '3', name: 'Bancolombia', nit: '890903938-8', companyType: 'banco', status: 'active', appsCount: 5, createdAt: '2024-07-20' },
  { id: '4', name: 'MercadoLibre CO', nit: '900456789-3', companyType: 'marketplace', status: 'pending_approval', appsCount: 0, createdAt: '2024-11-10' },
  { id: '5', name: 'Finaktiva', nit: '901567890-4', companyType: 'fintech', status: 'suspended', appsCount: 1, createdAt: '2024-06-05' },
  { id: '6', name: 'Lulo Bank', nit: '901678901-5', companyType: 'banco', status: 'active', appsCount: 2, createdAt: '2024-10-12' },
  { id: '7', name: 'Addi S.A.S.', nit: '901890123-6', companyType: 'fintech', status: 'active', appsCount: 1, createdAt: '2024-11-20' },
  { id: '8', name: 'Falabella CO', nit: '800567890-7', companyType: 'e-commerce', status: 'active', appsCount: 4, createdAt: '2024-05-10' },
  { id: '9', name: 'Bold Colombia', nit: '901345678-8', companyType: 'fintech', status: 'pending_approval', appsCount: 0, createdAt: '2024-12-01' },
  { id: '10', name: 'Tpaga', nit: '901456789-9', companyType: 'fintech', status: 'rejected', appsCount: 0, createdAt: '2024-10-05' },
];

export const mockAuditLogs: AuditEntry[] = Array.from({ length: 50 }, (_, i) => ({
  id: `audit-${i}`,
  correlationId: `corr-${crypto.randomUUID().slice(0, 8)}`,
  action: ['api_call', 'login', 'key_regenerated', 'ally_suspended', 'quota_changed'][Math.floor(Math.random() * 5)],
  endpoint: ['/api/v1/quotes', '/api/v1/policies', '/api/v1/payments', '/auth/login'][Math.floor(Math.random() * 4)],
  method: ['GET', 'POST', 'PATCH'][Math.floor(Math.random() * 3)],
  statusCode: [200, 201, 400, 401, 500][Math.floor(Math.random() * 5)],
  responseTimeMs: Math.floor(Math.random() * 500) + 50,
  ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  organizationName: mockOrganizations[Math.floor(Math.random() * mockOrganizations.length)].name,
}));

export interface AdminApp {
  id: string;
  name: string;
  organizationName: string;
  plan: 'monthly' | 'transactional';
  status: 'active' | 'suspended';
  quotaUsed: number;
  quotaLimit: number;
  apiKeySuffix: string;
  createdAt: string;
}

export const mockAdminApps: AdminApp[] = [
  { id: 'a1', name: 'Rappi Seguros App', organizationName: 'Rappi Colombia', plan: 'monthly', status: 'active', quotaUsed: 7200, quotaLimit: 10000, apiKeySuffix: '...h8i9j0', createdAt: '2024-08-20' },
  { id: 'a2', name: 'Rappi Checkout Insurance', organizationName: 'Rappi Colombia', plan: 'transactional', status: 'active', quotaUsed: 3100, quotaLimit: 10000, apiKeySuffix: '...k2l3m4', createdAt: '2024-09-15' },
  { id: 'a3', name: 'Nequi Microseguros', organizationName: 'Nequi S.A.', plan: 'monthly', status: 'active', quotaUsed: 9800, quotaLimit: 10000, apiKeySuffix: '...n5o6p7', createdAt: '2024-09-05' },
  { id: 'a4', name: 'Bancolombia Vida Digital', organizationName: 'Bancolombia', plan: 'monthly', status: 'active', quotaUsed: 4500, quotaLimit: 50000, apiKeySuffix: '...q8r9s0', createdAt: '2024-07-25' },
  { id: 'a5', name: 'Lulo Protección', organizationName: 'Lulo Bank', plan: 'transactional', status: 'active', quotaUsed: 1200, quotaLimit: 10000, apiKeySuffix: '...t1u2v3', createdAt: '2024-10-18' },
  { id: 'a6', name: 'Finaktiva Pólizas', organizationName: 'Finaktiva', plan: 'monthly', status: 'suspended', quotaUsed: 0, quotaLimit: 10000, apiKeySuffix: '...w4x5y6', createdAt: '2024-06-10' },
];

export interface ApiVersionAdmin {
  id: string;
  apiName: string;
  version: string;
  status: 'active' | 'deprecated' | 'retired';
  publishedAt: string;
  retirementDate: string | null;
  consumers: number;
}

export const mockApiVersions: ApiVersionAdmin[] = [
  { id: 'v1', apiName: 'Cotización de Seguros', version: 'v2', status: 'active', publishedAt: '2024-10-01', retirementDate: null, consumers: 8 },
  { id: 'v2', apiName: 'Cotización de Seguros', version: 'v1', status: 'deprecated', publishedAt: '2024-03-15', retirementDate: '2025-03-15', consumers: 3 },
  { id: 'v3', apiName: 'Emisión de Pólizas', version: 'v1', status: 'active', publishedAt: '2024-06-01', retirementDate: null, consumers: 6 },
  { id: 'v4', apiName: 'Procesamiento de Pagos', version: 'v1', status: 'active', publishedAt: '2024-07-01', retirementDate: null, consumers: 7 },
  { id: 'v5', apiName: 'Consulta de Pólizas', version: 'v2', status: 'active', publishedAt: '2024-09-01', retirementDate: null, consumers: 9 },
  { id: 'v6', apiName: 'Verificación SARLAFT', version: 'v1', status: 'active', publishedAt: '2024-08-01', retirementDate: null, consumers: 5 },
  { id: 'v7', apiName: 'Modificaciones de Póliza', version: 'v1', status: 'deprecated', publishedAt: '2024-04-01', retirementDate: '2026-07-15', consumers: 2 },
];
