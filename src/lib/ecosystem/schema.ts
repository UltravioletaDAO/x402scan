import z from 'zod';

export const ecosystemItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  logoUrl: z.string().transform(path => `https:/x402.org/${path}`),
  websiteUrl: z.url(),
  category: z.enum([
    'Client-Side Integrations',
    'Services/Endpoints',
    'Ecosystem Infrastructure & Tooling',
    'Learning & Community Resources',
  ]),
});

export type EcosystemItem = z.infer<typeof ecosystemItemSchema>;
