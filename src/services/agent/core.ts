import { createX402OpenAI } from '@merit-systems/ai-x402/server';
import { stepCountIs, streamText, UIMessage, convertToModelMessages } from 'ai';
import { Signer } from 'x402-fetch';
import { createX402AITools } from './get-tools';
import { Tool } from 'ai';

const listAllTools = async (walletClient: Signer) => {
  const tools = await createX402AITools(walletClient);
  return tools;
};

const getSelectedTools = async (
  walletClient: Signer,
  tools: string[]
): Promise<Record<string, Tool>> => {
  const allTools = await createX402AITools(walletClient);

  return Object.fromEntries(tools.map(tool => [tool, allTools[tool]]));
};

export async function InvokeAgent(
  model: string,
  walletClient: Signer,
  messages: UIMessage[],
  selectedTools: Record<string, Tool>
) {
  const x402 = createX402OpenAI(walletClient);
  const result = streamText({
    model: x402(model),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(50),
    tools: selectedTools,
  });
  return result;
}
