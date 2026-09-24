# Production Release Notes

## Build

Run the complete release check:

```text
npm run check
```

The production output is generated in `dist/`. Preview it locally with:

```text
npm run preview
```

## Hosting requirements

- Serve the application over HTTPS in production.
- Use a browser with File System Access API support, currently Chromium-based browsers provide the most consistent support.
- Configure the host to fall back to `index.html` for client-side routes such as `/dashboard`, `/people`, and `/backup`.
- Do not place parish data files in the web host public directory.
- Parish data remains in the user-selected local folder.

## Release limitations

This application is local-first and client-side. It does not provide server identity management, cloud synchronization, remote access, or multi-computer coordination. Passwords are locally verified with PBKDF2, but production deployments should still review browser storage, device access, and operational recovery policies.

Before release, manually verify directory permission recovery, backup restore, browser compatibility, and the complete role matrix in the target hosting environment.

The current backup snapshot covers structured JSON records. Binary templates are stored locally under `templates/` but are not yet copied into JSON snapshots; include that directory in an operational backup policy before relying on template recovery.