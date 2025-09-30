export function getBazaarMethod(outputSchema: unknown): string | undefined {
  if (
    typeof outputSchema === 'object' &&
    outputSchema &&
    'input' in outputSchema
  ) {
    const input = (outputSchema as { input: unknown }).input;
    if (typeof input === 'object' && input && 'method' in input) {
      return (input as { method: unknown }).method as string;
    }
  }
  return undefined;
}
