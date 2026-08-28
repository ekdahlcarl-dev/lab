# Payment Checkout App

## ORBIT has moved

ORBIT now lives in its own repository: [ekdahlcarl-dev/orbit](https://github.com/ekdahlcarl-dev/orbit). Create ORBIT Codespaces and run its CI from that repository. The former `orbit/` directory and ORBIT-only CI/devcontainer configuration have been removed here after verifying the migrated repository. The original history remains available in LAB.

First version based on the approved stack:

- Next.js + React + TypeScript
- Tailwind CSS
- Payment provider abstraction (starting with Swish)
- Ready for future payment methods

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm test
npm run build
```

GitHub Actions runs the same test and build checks for pull requests and pushes to `main`.

## Linear integration

The repository includes a workspace-level MCP configuration for Linear. Open the
project in VS Code, start the `linear` server from the MCP servers view, and
complete the browser-based authorization prompt to connect your Linear account.
No Linear credentials are stored in the repository.

## LAB-5 foundation

The webshop foundation includes domain models for products, categories, customers, carts, and orders; catalog data separated from UI code; product catalog and product detail pages; and the application entry point leading to the catalog.
