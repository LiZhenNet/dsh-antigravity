#!/usr/bin/env node
import {
  FileCredentialStore,
  credentialPath,
  loginAndSave,
  terminalInteraction,
} from "../lib/index.js";

const controller = new AbortController();
const args = new Set(process.argv.slice(2));
const logout = args.has("--logout");

for (const signalName of ["SIGINT", "SIGTERM"]) {
  process.once(signalName, () => {
    controller.abort(new Error(`${signalName} received`));
  });
}

try {
  const store = new FileCredentialStore(credentialPath());
  if (logout) {
    await store.delete();
    console.log(`Removed Antigravity credentials from ${store.path()}`);
    process.exit(0);
  }
  const credentials = await loginAndSave(store, terminalInteraction(controller.signal));
  const suffix = credentials.email ? ` for ${credentials.email}` : "";
  console.log(`Antigravity login complete${suffix}.`);
  console.log(`Credentials saved to ${store.path()}`);
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Antigravity login failed: ${detail}`);
  process.exitCode = 1;
}
