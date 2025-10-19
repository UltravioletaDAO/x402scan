import z from 'zod';

export const createAgentConfigurationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  model: z.string().optional(),
  systemPrompt: z.string(),
  visibility: z.enum(['public', 'private']).optional().default('private'),
  resourceIds: z.array(z.uuid()).min(1),
});
