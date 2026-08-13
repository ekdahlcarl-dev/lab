# Security and configuration review

## Secrets

Runtime secrets must be supplied by the deployment platform. The repository must never contain production `.env` files, private keys, client certificates, P12/PFX bundles, database passwords, or Swish credentials. `.gitignore` excludes common local secret and certificate paths; `.env.example` contains placeholders only.

## Payment configuration

`PAYMENT_MODE=mock` is safe for local development and automated tests. Real Swish mode requires deployment-managed mutual-TLS credentials plus `SWISH_API_URL`, `SWISH_CALLBACK_URL`, and `SWISH_PAYEE_ALIAS`. Run `npm run check:config` during deployment.

## Logging

Use the structured logger for server errors and operational events. Logs must not contain certificate material, API secrets, payment credentials, or complete customer request bodies. Prefer identifiers such as order ID, payment ID, route and normalized status.

## Pull request quality gate

Every pull request runs configuration validation, automated tests and a production Next.js build. Secret-like files must remain excluded from source control. Dependency changes should be reviewed deliberately and production dependencies should be checked for known vulnerabilities as part of release preparation.
