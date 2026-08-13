# Deployment and rollback

## Production prerequisites

- Node.js 22 runtime.
- PostgreSQL reachable through `DATABASE_URL`.
- `PAYMENT_MODE=mock` for non-production demos or `PAYMENT_MODE=swish` for real Swish.
- Real Swish deployments must provide `SWISH_API_URL`, `SWISH_CALLBACK_URL`, `SWISH_PAYEE_ALIAS`, and mutual-TLS certificate material through the platform secret store. Never commit certificate files or private keys.

Run before deployment:

```bash
npm install --no-audit --no-fund
npm test
npm run check:config
npm run build
```

For PostgreSQL-backed environments run migrations before switching traffic:

```bash
npm run db:migrate
npm run db:seed
```

## Release procedure

1. Merge only a green pull request into `main`.
2. Build an immutable deployment from the merged commit SHA.
3. Apply database migrations before routing production traffic.
4. Start the application with `npm start`.
5. Verify `GET /api/health` returns HTTP 200 and `status: ok`.
6. Smoke-test product browsing, cart, checkout and the configured payment mode.
7. Watch structured application logs for checkout/payment errors.

## Rollback

Application rollback should deploy the last known-good commit/build artifact rather than modifying production files in place.

1. Stop routing new traffic to the failed release.
2. Redeploy the previous known-good commit/build artifact.
3. Verify `/api/health` and the checkout smoke test.
4. Do not automatically reverse database migrations. Schema migrations must remain backward compatible with the previous application version. If a destructive migration is ever required, create a separately reviewed data recovery plan before deployment.
5. Record the failed release SHA and relevant structured log events for follow-up.

## Health and observability

`GET /api/health` is the platform liveness endpoint. Application errors should be emitted as structured JSON logs so a hosting platform can ingest them. No credentials, payment secrets, certificate content, or full customer payloads should be written to logs.
