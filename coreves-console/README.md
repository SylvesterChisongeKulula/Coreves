# Coreves console

The internal billing and licensing console at **billing.coreves.software**. It covers:
- **Leads.** Demo requests from coreves.software, posted in by the website.
- **Customers and deployments.** Each CoreVesFin client server is one deployment.
- **Invoices for bank-transfer payment,** with recorded payments.
- **Signed licences.** Every CoreVesFin server polls the console for its licence.

This is a separate app from the marketing site (`../coreves-frontend`), because it
holds the licence-signing private key.

## How it fits together

```
coreves.software ──POST /api/v1/leads (HMAC)──────────────▶ console ──▶ Postgres
client servers   ──GET /api/v1/deployments/{id}/subscription──▶   │
team (browser)   ──password + emailed code──▶ admin UI             └──▶ Resend (codes, invoices, receipts)
```

**Recording a payment that covers an invoice:**
- extends the deployment's paid-through to the invoice's period end
- signs a new Ed25519 licence
- emails a receipt

The client server picks up the licence on its next hourly poll, or straight away
when someone clicks **Check now** on its Subscription page.

The licence format and the poll contract are fixed by CoreVesFin. See
`corevesfin/docs/SUBSCRIPTION_LICENSING.md`, `LicenceVerifier.java` and
`RemoteSubscription.java`. `server/utils/licence.ts` must keep producing tokens
that `LicenceVerifier` accepts; this was cross-checked when the console was built.

## Roles

| Role | Can |
|---|---|
| OWNER | Everything, including the team and company settings |
| BILLING | Leads, customers, deployments, invoices, payments, licences |
| VIEWER | Read-only. No team list |

Roles are enforced in `server/middleware/auth.ts` (rules in `server/utils/roles.ts`).
The UI only hides buttons.

## Configuration (Dokploy environment)

| Variable | Notes |
|---|---|
| `POSTGRES_PASSWORD` | For the bundled Postgres. |
| `SESSION_PASSWORD` | 32+ random characters (`openssl rand -hex 32`). Changing it signs everyone out. |
| `LICENCE_PRIVATE_KEY` | The Ed25519 private key PEM from `~/.corevesfin/licence/licence-private.pem`. Its public half is baked into every CoreVesFin image. Paste it as one line with `\n`, or as multi-line text. **Never** put it anywhere else. |
| `LEADS_WEBHOOK_SECRET` | Shared with the website's `LEADS_WEBHOOK_SECRET` (`openssl rand -hex 32`). |
| `RESEND_API_KEY` | Required. Sign-in codes are emailed. |
| `MAIL_FROM` | Defaults to `Coreves Billing <billing@mail.coreves.software>`. Must be on a Resend-verified domain. |
| `OWNER_EMAIL` / `OWNER_PASSWORD` | Creates the first owner on first boot only, when there are no users. Remove them afterwards. |
| `CONSOLE_DOMAIN` | Defaults to `billing.coreves.software`. |
| `IMAGE_TAG` | `latest`, or a commit sha to pin or roll back. |

## Deploy (Dokploy)

1. **DNS:** add an A record for `billing.coreves.software` pointing at the VPS. If you
   use Cloudflare, set it to DNS-only, or make sure Traefik's certificate resolver can
   still issue.
2. **CI:** push to `main` and the `Console` workflow tests, builds and pushes
   `ghcr.io/sylvesterchisongekulula/coreves-console`. The package is private. Dokploy
   pulls it with the `ghcr.io` registry login it already has.
3. **Create the app:** in Dokploy, create a **Compose** app from this repo with
   compose path `coreves-console/docker-compose.yml`, set the environment above,
   and deploy.
4. **Auto-deploy (optional):** add repo secrets `DOKPLOY_URL`, `DOKPLOY_API_KEY`
   and `CONSOLE_COMPOSE_ID`, and every push to `main` redeploys.
5. **First sign-in:** sign in with `OWNER_EMAIL`, using the code sent by email.
   Then remove `OWNER_*` from the env.
6. **Settings:** fill in the legal name, TPIN, address and bank details. These are
   printed on every invoice.

## Connecting a client server

1. Open the customer (or convert their lead) and choose **Add deployment**:
   - a permanent id, e.g. `acme-loans`
   - the app domain
   - the plan and price
2. Copy the **API key**. It is shown once. If it's lost, use **Rotate API key**.
3. On the client server, set these in `.env`, then run `docker compose up -d backend`:
   - `BILLING_DEPLOYMENT_ID=acme-loans`
   - `BILLING_API_URL=https://billing.coreves.software`
   - `BILLING_API_KEY=…`
4. Go live by doing one of these:
   - **Invoice next period**, then **Record payment** when the money arrives.
   - **Set paid-through manually** (audited) to go live first.

The deployment page then shows the server's last poll, its IP, and whether it
reports enforcement **on**. **Off** means someone disabled it on that server.

## Monthly routine

- On the 25th at 06:00 UTC, drafts are created for every deployment due in the
  coming month. Review them under **Invoices → draft**, then **Send**.
- When a transfer lands, open the invoice and click **Record payment**. Part-payments
  are fine; access extends only once the invoice is fully paid.
- The **Dashboard → Needs attention** list shows deployments that are:
  - unpaid or in grace
  - due within 7 days
  - silent for over 24 hours
  - reporting enforcement off

## Development

```sh
docker run -d --name console-pg -p 5434:5432 -e POSTGRES_DB=console -e POSTGRES_USER=console -e POSTGRES_PASSWORD=console postgres:17-alpine
cp .env.example .env    # fill in NUXT_SESSION_PASSWORD, NUXT_LICENCE_PRIVATE_KEY, NUXT_OWNER_*
npm install
npm run dev             # without NUXT_RESEND_API_KEY, emails (incl. sign-in codes) print to the terminal
npm test                # unit tests
npm run typecheck
```

**Schema changes:** edit `server/db/schema.ts`, then run `npm run db:generate -- --name <change>`.
Migrations run automatically at startup. Never edit an applied migration.

**Testing against a CoreVesFin backend locally:** run the production build
(`npm run build && node --env-file=.env .output/server/index.mjs`), not `npm run dev`.
Java's HTTP client sends an `h2c` upgrade, which the dev server's websocket handler
swallows.
