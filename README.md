Install dependencies and start the Node.js server:

```txt
npm install
npm run dev
```

The API uses PostgreSQL hosted by Neon through the `DATABASE_URL` environment
variable. Set `APP_URL`, `BETTER_AUTH_SECRET`, and `ENVIRONMENT` before
starting the server.

## Production deployment

The production image is built with Docker and published to GitHub Container
Registry by `.github/workflows/deploy.yml`. The workflow deploys the `nodejs-adapter`
branch to a VPS over SSH.

Create the deployment directory on the VPS and add a `.env` file containing
`DATABASE_URL`, `APP_URL`, `BETTER_AUTH_SECRET`, and `ENVIRONMENT=production`.
The VPS must have Docker Engine and Docker Compose installed.

Configure these GitHub Actions secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_DIR`
- `GHCR_USERNAME`
- `GHCR_TOKEN` with permission to read packages
