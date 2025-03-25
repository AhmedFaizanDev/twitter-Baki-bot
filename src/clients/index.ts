import { TwitterClientInterface } from "@elizaos/client-twitter";
import { AgentRuntime, Clients } from "@elizaos/core";
import type { Character } from "@elizaos/core";

export async function initializeClients(
  character: Character,
  runtime: AgentRuntime,
) {
  const clients = [];

  if (character.clients?.includes(Clients.TWITTER)) {
    const twitterClient = await TwitterClientInterface.start(runtime);
    if (twitterClient) clients.push(twitterClient);
  }

  return clients;
}
