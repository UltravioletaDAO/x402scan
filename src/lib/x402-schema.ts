import { z, type ZodError } from 'zod';
import { x402ResponseSchema, type x402Response, type schemes } from 'x402/types';

// ==================== MAIN EXPORTS ====================

/**
 * Parse and validate x402 response data with lenient error field handling
 * Returns enhanced response with normalized, strongly-typed outputSchema
 */
export function parseX402Response(data: unknown): Result<ParsedX402Response> {
  const errors: string[] = [];

  // Layer 1: Parse x402 response with lenient error handling
  const parseResult = parseRawX402Response(data);
  if (!parseResult.success) {
    const issues = parseResult.error?.issues ?? [];
    issues.forEach((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      errors.push(`${path}: ${issue.message}`);
    });
    return { success: false, data: null, errors };
  }

  // Layer 2: Enhance response by normalizing all outputSchemas
  const enhanced = enhanceX402Response(parseResult.data);

  return { success: true, data: enhanced, errors };
}


// ==================== TYPES ====================

export type NormalizedInputSchema = {
  type?: string;
  method?: string;
  headerFields?: Record<string, FieldDef>;
  queryParams: Record<string, FieldDef>;
  bodyType?: string;
  bodyFields: Record<string, FieldDef>;
};

export type FieldDef = {
  type?: string;
  required?: boolean;
  description?: string;
  enum?: string[];
  properties?: Record<string, unknown>;
};

type Result<T> = { success: true; data: T; errors: string[] } | { success: false; data: null; errors: string[] };

// Enhanced x402Response with normalized, strongly-typed outputSchema
export interface ParsedX402Response extends Omit<x402Response, 'accepts'> {
  accepts?: Array<ParsedAccept>;
}

interface ParsedAccept {
  scheme: (typeof schemes)[number];
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra?: Record<string, unknown>;
  outputSchema?: {
    input: NormalizedInputSchema;
    output?: Record<string, unknown>;
  };
}

// ==================== LAYER 1: RESPONSE PARSING ====================

/**
 * Parse raw x402 response with lenient error field handling
 */
function parseRawX402Response(data: unknown): { success: true; data: x402Response } | { success: false; error: ZodError<unknown> } {
  const strictResult = x402ResponseSchema.safeParse(data);
  if (strictResult.success) {
    return { success: true, data: strictResult.data };
  }

  // Try lenient parsing for responses with error fields
  return parseWithLenientError(data, strictResult.error as unknown as ZodError<unknown>);
}

/**
 * Handle x402 response with lenient error field parsing
 */
function parseWithLenientError(data: unknown, originalError: ZodError<unknown>): { success: true; data: x402Response } | { success: false; error: ZodError<unknown> } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { success: false, error: originalError };
  }

  // Check if all errors are just about the error field
  const errorFieldIssues = originalError.issues.filter((err) =>
    err.path.length === 1 && err.path[0] === 'error'
  );

  if (errorFieldIssues.length > 0 && originalError.issues.length === errorFieldIssues.length) {
    // Try parsing without the error field, then add it back
    const { error, ...dataWithoutError } = data as Record<string, unknown> & { error?: unknown };
    const lenientResult = x402ResponseSchema.safeParse(dataWithoutError);

    if (lenientResult.success) {
      return { success: true, data: { ...lenientResult.data, error } as x402Response };
    }
  }

  return { success: false, error: originalError };
}

// ==================== LAYER 2: ENHANCEMENT ====================

/**
 * Enhance x402Response by normalizing all outputSchemas
 */
function enhanceX402Response(response: x402Response): ParsedX402Response {
  const enhanced: ParsedX402Response = {
    ...response,
    accepts: response.accepts?.map(accept => enhanceAccept(accept))
  };

  return enhanced;
}

/**
 * Enhance a single accept entry by normalizing its outputSchema
 */
function enhanceAccept(accept: Record<string, unknown>): ParsedAccept {
  const base: ParsedAccept = {
    scheme: accept.scheme as ParsedAccept['scheme'],
    network: accept.network as string,
    maxAmountRequired: accept.maxAmountRequired as string,
    resource: accept.resource as string,
    description: accept.description as string,
    mimeType: accept.mimeType as string,
    payTo: accept.payTo as string,
    maxTimeoutSeconds: accept.maxTimeoutSeconds as number,
    asset: accept.asset as string,
    extra: accept.extra as Record<string, unknown> | undefined
  };

  // Extract and normalize outputSchema if present
  const rawOutputSchema = (accept.outputSchema ?? accept.output_schema) as Record<string, unknown> | undefined;
  if (rawOutputSchema && typeof rawOutputSchema === 'object') {
    const inputData = extractInputData(rawOutputSchema);
    const normalizedInput = normalizeInputSchema(inputData);

    // Validate the normalized input
    const validation = inputSchema.safeParse(normalizedInput);
    if (validation.success) {
      base.outputSchema = {
        input: validation.data,
        output: rawOutputSchema.output as Record<string, unknown> | undefined
      };
    }
  }

  return base;
}

// ==================== LAYER 3: NORMALIZATION ====================

/**
 * Extract input data from outputSchema, handling nested structure
 */
function extractInputData(outputSchema: Record<string, unknown>): Record<string, unknown> {
  const input = outputSchema.input;
  return input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

/**
 * Normalize input schema by converting snake_case to camelCase and cleaning field definitions
 */
function normalizeInputSchema(input: Record<string, unknown>): NormalizedInputSchema {
  const normalized = normalizeFieldNames(input);

  return {
    type: typeof normalized.type === 'string' ? normalized.type : undefined,
    method: typeof normalized.method === 'string' ? normalized.method : undefined,
    headerFields: normalized.headerFields ? normalizeFieldRecord(normalized.headerFields) : undefined,
    queryParams: normalizeFieldRecord(normalized.queryParams ?? {}),
    bodyType: typeof normalized.bodyType === 'string' ? normalized.bodyType : undefined,
    bodyFields: normalizeFieldRecord(normalized.bodyFields ?? {}),
  };
}

/**
 * Convert snake_case fields to camelCase
 */
function normalizeFieldNames(obj: Record<string, unknown>): {
  queryParams?: unknown;
  bodyFields?: unknown;
  bodyType?: unknown;
  headerFields?: unknown;
} & Record<string, unknown> {
  const result = { ...obj };

  // Handle snake_case to camelCase conversion
  if ('query_params' in obj) {
    result.queryParams = obj.query_params;
    delete result.query_params;
  }
  if ('body_fields' in obj) {
    result.bodyFields = obj.body_fields;
    delete result.body_fields;
  }
  if ('body_type' in obj) {
    result.bodyType = obj.body_type;
    delete result.body_type;
  }
  if ('header_fields' in obj) {
    result.headerFields = obj.header_fields;
    delete result.header_fields;
  }

  return result;
}

/**
 * Normalize a record of field definitions
 */
function normalizeFieldRecord(record: unknown): Record<string, FieldDef> {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return {};
  }

  const result: Record<string, FieldDef> = {};

  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    const normalized = normalizeFieldDef(value);
    if (normalized) {
      result[key] = normalized;
    }
  }

  return result;
}

/**
 * Normalize a single field definition, handling various formats
 */
function normalizeFieldDef(field: unknown): FieldDef | null {
  if (!field) return null;

  // Handle string shorthand
  if (typeof field === 'string') {
    return { type: field };
  }

  // Handle object format
  if (typeof field === 'object' && !Array.isArray(field)) {
    const obj = field as Record<string, unknown>;
    return {
      type: typeof obj.type === 'string' ? obj.type : undefined,
      required: typeof obj.required === 'boolean' ? obj.required : undefined,
      description: typeof obj.description === 'string' ? obj.description : undefined,
      enum: Array.isArray(obj.enum) && obj.enum.every(x => typeof x === 'string')
        ? obj.enum
        : undefined,
      properties: obj.properties && typeof obj.properties === 'object' && !Array.isArray(obj.properties)
        ? obj.properties as Record<string, unknown>
        : undefined,
    };
  }

  return null;
}

// ==================== SCHEMAS (Implementation Details) ====================

const fieldDefSchema = z.object({
  type: z.string().optional(),
  required: z.boolean().optional(),
  description: z.string().optional(),
  enum: z.array(z.string()).optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

const inputSchema = z.object({
  type: z.string().optional(),
  method: z.string().optional(),
  queryParams: z.record(z.string(), fieldDefSchema),
  bodyFields: z.record(z.string(), fieldDefSchema),
  bodyType: z.string().optional(),
  headerFields: z.record(z.string(), fieldDefSchema).optional(),
});

export const outputSchema = z.object({
  input: z.object({
    type: z.literal('http'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    discoverable: z.boolean().optional(),
    queryParams: z.record(z.string(), fieldDefSchema).optional(),
    bodyFields: z.record(z.string(), fieldDefSchema).optional(),
    bodyType: z.enum(['json', 'form-data', 'text']).optional(),
    headerFields: z.record(z.string(), fieldDefSchema).optional(),
  }),
  output: z.record(z.string(), z.unknown()).optional(),
});

export type OutputSchema = z.infer<typeof outputSchema>;