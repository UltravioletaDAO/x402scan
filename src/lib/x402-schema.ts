import {
  HTTPRequestStructureSchema,
  PaymentRequirementsSchema,
} from 'x402/types';
import { z as z3 } from 'zod3';

// ==================== TYPES ====================

// Handle both string shorthand and object field definitions
const FieldDefSchema = z3.preprocess(
  val => {
    // Convert string shorthand to object
    if (typeof val === 'string') {
      return { type: val };
    }
    return val;
  },
  z3.object({
    type: z3.string().optional(),
    required: z3.boolean().optional(),
    description: z3.string().optional(),
    enum: z3.array(z3.string()).optional(),
    properties: z3.record(z3.unknown()).optional(),
  })
);

// Enhanced input schema with proper field definitions
const EnhancedInputSchema = HTTPRequestStructureSchema.omit({
  queryParams: true,
  bodyFields: true,
  headerFields: true,
}).extend({
  queryParams: z3.record(FieldDefSchema).optional(),
  bodyFields: z3.record(FieldDefSchema).optional(),
  headerFields: z3.record(FieldDefSchema).optional(),
});

// Enhanced outputSchema
const EnhancedOutputSchema = z3.object({
  input: EnhancedInputSchema,
  output: z3.record(z3.unknown()).optional(),
});

// Enhanced PaymentRequirements
const EnhancedPaymentRequirementsSchema = PaymentRequirementsSchema.extend({
  outputSchema: EnhancedOutputSchema.optional(),
});

// Complete x402Response with lenient error field (using zod3)
const EnhancedX402ResponseSchema = z3.object({
  x402Version: z3.number(),
  error: z3.string().optional(), // Accept any error string
  accepts: z3.array(EnhancedPaymentRequirementsSchema).optional(),
});

// Types
export type ParsedX402Response = z3.infer<typeof EnhancedX402ResponseSchema>;

type Result<T> =
  | { success: true; data: T; errors: string[] }
  | { success: false; data: null; errors: string[] };

// ==================== MAIN EXPORTS ====================

/**
 * Parse and validate x402 response data with lenient error field handling
 * Returns enhanced response with normalized, strongly-typed outputSchema
 */
export function parseX402Response(data: unknown): Result<ParsedX402Response> {
  // Step 1: Selective snake → camel conversion (only for x402 protocol fields, not API schemas)
  const normalized = normalizeX402Fields(data);

  // Step 2: Parse with our enhanced schema (handles everything!)
  const result = EnhancedX402ResponseSchema.safeParse(normalized);

  if (result.success) {
    return { success: true, data: result.data, errors: [] };
  }

  // Format errors
  const errors = result.error.issues.map(
    issue => `${issue.path.join('.')}: ${issue.message}`
  );
  return { success: false, data: null, errors };
}

/**
 * Normalize only x402 protocol fields, preserve API schema field names
 */
function normalizeX402Fields(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const data = obj as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === 'accepts' && Array.isArray(value)) {
      // Process accepts array but preserve outputSchema contents
      result[key] = value.map(accept => normalizeAcceptEntry(accept));
    } else {
      // Convert x402 protocol fields
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = value;
    }
  }

  return result;
}

/**
 * Normalize accept entry while preserving outputSchema field names
 */
function normalizeAcceptEntry(accept: unknown): unknown {
  if (!accept || typeof accept !== 'object' || Array.isArray(accept)) {
    return accept;
  }

  const data = accept as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === 'outputSchema' || key === 'output_schema') {
      // Normalize outputSchema structure but preserve API field names
      result.outputSchema = normalizeOutputSchema(value);
    } else {
      // Convert x402 protocol fields
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = value;
    }
  }

  return result;
}

/**
 * Normalize outputSchema structure (input/output keys and HTTP schema fields)
 * but preserve the actual API field names within queryParams/bodyFields/headerFields
 */
function normalizeOutputSchema(outputSchema: unknown): unknown {
  if (
    !outputSchema ||
    typeof outputSchema !== 'object' ||
    Array.isArray(outputSchema)
  ) {
    return outputSchema;
  }

  const data = outputSchema as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === 'input') {
      result.input = normalizeInputSchema(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Normalize input schema structure (convert query_params -> queryParams, etc.)
 * but preserve field names within the param/field records
 */
function normalizeInputSchema(input: unknown): unknown {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return input;
  }

  const data = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Convert HTTP schema structure field names
    if (key === 'query_params') {
      result.queryParams = value; // Preserve field names within
    } else if (key === 'body_fields') {
      result.bodyFields = value; // Preserve field names within
    } else if (key === 'body_type') {
      result.bodyType = value;
    } else if (key === 'header_fields') {
      result.headerFields = value; // Preserve field names within
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Converts a single snake_case string to camelCase
 */
function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
