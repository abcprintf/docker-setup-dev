# Wakapi Docker Setup

Self-hosted Wakatime-compatible backend for coding statistics.

## Deployment

1. **Prepare Environment Variables**
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

   Generate a salt for `WAKAPI_PASSWORD_SALT`:
   ```bash
   openssl rand -base64 32
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

## Configuration
- **Port**: `3011`
- **Database**: PostgreSQL 17
- **Public URL**: Set `WAKAPI_PUBLIC_URL` in your `.env` (e.g., `http://localhost:3011`)

## Integration
To track data, configure your WakaTime plugin in your IDE (VS Code, JetBrains, etc.) to use your self-hosted URL:
- **API URL**: `http://<your-server-ip>:3011/api`
- **API Key**: Found in your Wakapi dashboard after registration.
