import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";
import path from "path";

export function initializeDatabase(dataDir: string) {
  const dbPath = path.resolve(dataDir, "db.sqlite");
  return new SqliteDatabaseAdapter(new Database(dbPath));
}
