# Production Deployment

The `hnet.ir` deployment uses the `opencode-dev` branch in `/opt/abrit-payload`, Docker Compose project `abrit-payload`, and Nginx upstream `127.0.0.1:3001`.

## Update

Run as root on the server:

```sh
cd /opt/abrit-payload
sh deploy/update.sh
```

The script creates a timestamped PostgreSQL backup, fast-forwards only `opencode-dev`, applies pending Payload migrations, rebuilds the Next.js standalone output and runtime image, recreates the web container, and waits for `/readyz`.

The script does not run the canonical seed during routine updates, so editor-managed production content is preserved.

## First Bootstrap

For a fresh database, start PostgreSQL and run the builder once with the seed between migration and build:

```sh
docker compose -f deploy/compose.yaml up -d postgres
docker compose -f deploy/compose.yaml --profile build run --rm builder \
  sh -c 'npm ci && npm run migrate && npm run seed && npm run build'
docker compose -f deploy/compose.yaml build web
docker compose -f deploy/compose.yaml up -d web
```

Keep `deploy/.env.production` mode `0600`; it is Git-ignored and must never be committed.
