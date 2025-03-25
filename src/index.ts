import {
  AgentRuntime,
  elizaLogger,
  stringToUuid,
  type Character,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDbCache } from "./cache/index.ts";
import { character } from "./character.ts";
import { initializeClients } from "./clients/index.ts";
import { getTokenForProvider } from "./config/index.ts";
import { initializeDatabase } from "./database/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startTwitterBot(character: Character) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;

    const token = getTokenForProvider(character.modelProvider, character);
    const dataDir = path.join(__dirname, "../data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);
    await db.init();

    const cache = initializeDbCache(character, db);
    const runtime = new AgentRuntime({
      databaseAdapter: db,
      token,
      modelProvider: character.modelProvider,
      evaluators: [],
      character,
      plugins: [bootstrapPlugin],
      providers: [],
      actions: [],
      services: [],
      managers: [],
      cacheManager: cache,
    });

    await runtime.initialize();
    runtime.clients = await initializeClients(character, runtime);

    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);
    elizaLogger.log("Twitter bot is running. Press Ctrl+C to stop.");

    return runtime;
  } catch (error) {
    elizaLogger.error(
      `Error starting Twitter bot for ${character.name}:`,
      error,
    );
    console.error(error);
    throw error;
  }
}

startTwitterBot(character).catch((error) => {
  elizaLogger.error("Failed to start Twitter bot:", error);
  process.exit(1);
});
