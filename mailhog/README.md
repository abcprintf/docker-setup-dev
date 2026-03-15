# MailHog

MailHog is an email testing tool for developers with a web interface.

## Default Configuration

- **SMTP Server Port**: `1025`
- **Web UI Port**: `8025`
- **Username**: *None (Disabled by default)*
- **Password**: *None (Disabled by default)*

## How to use

1. Start the service:
   ```bash
   docker-compose up -d
   ```
2. Access the Web UI at [http://localhost:8025](http://localhost:8025)
3. Configure your application to send emails via `localhost:1025` (no authentication required).

## Example: Laravel Configuration

Update your `.env` file with the following settings:

### If Laravel is running on the same Docker network:
```env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### If Laravel is running locally (outside Docker):
```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```
