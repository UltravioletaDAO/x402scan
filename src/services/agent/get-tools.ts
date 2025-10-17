import { z } from 'zod';

import { fetchWithX402Payment } from './fetch';
import { listResources } from '../db/resources';
import type {
  EnhancedAcceptsSchema,
  EnhancedOutputSchema,
} from '@/lib/x402/schema';
import { enhancedAcceptsSchema, enhancedOutputSchema } from '@/lib/x402/schema';

import type { Signer } from 'x402/types';
import type { Tool } from 'ai';
import type { ResourceOrigin } from '@prisma/client';
import { env } from '@/env';

type FieldDef = {
  type?: string;
  required?: boolean | string[];
  description?: string;
  enum?: string[];
  properties?: Record<string, FieldDef>;
  items?: FieldDef;
};

function fieldDefToZodType(fieldDef: FieldDef): z.ZodTypeAny {
  let zodType: z.ZodTypeAny;

  if (fieldDef.enum) {
    zodType = z.enum(fieldDef.enum as [string, ...string[]]);
  } else {
    switch (fieldDef.type) {
      case 'number':
      case 'integer':
        zodType = z.number();
        break;
      case 'boolean':
        zodType = z.boolean();
        break;
      case 'object':
        if (fieldDef.properties) {
          const shape: Record<string, z.ZodTypeAny> = {};
          for (const [key, subField] of Object.entries(fieldDef.properties)) {
            shape[key] = fieldDefToZodType(subField);
          }
          zodType = z.object(shape);
        } else {
          zodType = z.record(z.string(), z.unknown());
        }
        break;
      case 'array':
        if (fieldDef.items) {
          zodType = z.array(fieldDefToZodType(fieldDef.items));
        } else {
          zodType = z.array(z.string());
        }
        break;
      default:
        zodType = z.string();
    }
  }

  if (fieldDef.description) {
    zodType = zodType.describe(fieldDef.description);
  }

  if (!fieldDef.required) {
    zodType = zodType.optional();
  }

  return zodType;
}

function inputSchemaToZodSchema(inputSchema: EnhancedOutputSchema['input']) {
  const method = inputSchema.method.toUpperCase();
  const shape: Record<string, z.ZodTypeAny> = {};

  // For GET/HEAD/OPTIONS: use query params
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    if (inputSchema.queryParams) {
      for (const [key, fieldDef] of Object.entries(inputSchema.queryParams)) {
        shape[key] = fieldDefToZodType(fieldDef as FieldDef);
      }
    }
  }
  // For POST/PUT/PATCH/DELETE: use body fields
  else {
    if (inputSchema.bodyFields) {
      for (const [key, fieldDef] of Object.entries(inputSchema.bodyFields)) {
        shape[key] = fieldDefToZodType(fieldDef as FieldDef);
      }
    }
  }

  return z.object(shape);
}

export const generateX402ToolsOptionsSchema = z.object({
  resourceIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  searchQuery: z.string().optional(),
});

export async function generateX402Tools({
  resourceIds,
  tagIds,
  searchQuery,
}: z.infer<typeof generateX402ToolsOptionsSchema> = {}) {
  const resources = await listResources({
    ...(resourceIds ? { id: { in: resourceIds } } : undefined),
    ...(tagIds ? { tags: { some: { tagId: { in: tagIds } } } } : undefined),
    ...(searchQuery
      ? {
          OR: [
            { resource: { contains: searchQuery, mode: 'insensitive' } },
            {
              origin: {
                resources: {
                  some: {
                    accepts: {
                      some: {
                        payTo: { contains: searchQuery, mode: 'insensitive' },
                      },
                    },
                  },
                },
              },
            },
            {
              metadata: {
                path: ['title', 'description'],
                string_contains: searchQuery,
              },
            },
          ],
        }
      : undefined),
  });
  const toolDefinitions: (EnhancedAcceptsSchema & {
    id: string;
    outputSchema: EnhancedOutputSchema;
    origin: ResourceOrigin;
    invocations: number;
  })[] = [];

  for (const resource of resources) {
    if (resource.accepts) {
      for (const accept of resource.accepts) {
        const parsedAccept = enhancedAcceptsSchema
          .extend({
            outputSchema: enhancedOutputSchema,
          })
          .safeParse({
            ...accept,
            maxAmountRequired: accept.maxAmountRequired.toString(),
          });
        if (!parsedAccept.success) {
          continue;
        }
        toolDefinitions.push({
          id: resource.id,
          ...parsedAccept.data,
          origin: resource.origin,
          invocations: resource._count.invocations,
        });
      }
    }
  }

  return toolDefinitions;
}

export async function createX402AITools(
  resourceIds: string[],
  walletClient: Signer
): Promise<Record<string, Tool>> {
  const toolDefinitions = await generateX402Tools({
    resourceIds,
  });
  const aiTools: Record<string, Tool> = {};

  for (const toolDef of toolDefinitions) {
    const urlParts = new URL(toolDef.resource);
    const toolName = urlParts.pathname
      .split('/')
      .filter(Boolean)
      .join('_')
      .replace(/[^a-zA-Z0-9_]/g, '_');

    const parametersSchema = inputSchemaToZodSchema(toolDef.outputSchema.input);
    const method = toolDef.outputSchema.input.method.toUpperCase();

    aiTools[toolDef.id] = {
      description: `${toolName}: ${toolDef.description} (Paid API - ${toolDef.maxAmountRequired} on ${toolDef.network})`,
      inputSchema: parametersSchema,
      execute: async (params: Record<string, unknown>) => {
        let url = toolDef.resource;
        const requestInit: RequestInit = { method };

        // For GET/HEAD/OPTIONS: append query params to URL
        if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
              if (typeof value === 'object') {
                queryParams.append(key, JSON.stringify(value));
              } else if (typeof value === 'number') {
                queryParams.append(key, String(value));
              } else {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                queryParams.append(key, String(value));
              }
            }
          }
          url = `${toolDef.resource}?${queryParams.toString()}`;
        }
        // For POST/PUT/PATCH/DELETE: send as JSON body
        else {
          requestInit.body = JSON.stringify(params);
          requestInit.headers = { 'Content-Type': 'application/json' };
        }

        try {
          const response = await fetchWithX402Payment(fetch, walletClient)(
            new URL(
              `/api/proxy?url=${encodeURIComponent(url)}&share_data=true`,
              env.NEXT_PUBLIC_APP_URL
            ),
            requestInit
          );
          const data: unknown = await response.json();
          return data;
        } catch (error) {
          console.error('Error calling tool', error);
          throw error;
        }
      },
    };
  }

  return aiTools;
}
