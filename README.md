# Parish System

Phase 1 establishes a local-first parish workspace using React, TypeScript, Vite, IndexedDB, and the File System Access API.

## Development

```text
npm install
npm run dev
```

Use a recent Chromium-based browser over `localhost` or HTTPS. The app does not scan the computer. A user must explicitly choose a directory before Parish System can create the Phase 1 folders and metadata files.

## Phase 1 storage

The selected directory receives `account/`, `parish/`, `system/`, and `backups/`, plus the initial JSON metadata files. IndexedDB stores the directory handle and lightweight setup metadata; parish records do not go into IndexedDB.

Firefox and Safari may not support the required directory picker and permission APIs consistently. The app shows an explanatory unsupported-browser state rather than attempting an alternative folder.

The login flow is intentionally a prototype foundation. It does not provide production-grade authentication and never stores a password.