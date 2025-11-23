# Keycloak Docker Setup

Keycloak is an open-source Identity and Access Management solution for modern applications and services.

## Features

- Single Sign-On (SSO)
- Identity Brokering and Social Login
- User Federation
- Client Adapters
- Admin Console
- Account Management Console

## Quick Start

### 1. Start Keycloak

```bash
docker-compose up -d
```

### 2. Access Keycloak

- **Admin Console**: http://localhost:8080
- **Default Admin Credentials**:
  - Username: `admin`
  - Password: `admin_password_change_me`

### 3. Stop Keycloak

```bash
docker-compose down
```

### 4. Stop and Remove Volumes

```bash
docker-compose down -v
```

## Configuration

### Environment Variables

Edit the `docker-compose.yml` file to customize:

#### Database Configuration
- `POSTGRES_DB`: Database name (default: `keycloak`)
- `POSTGRES_USER`: Database user (default: `keycloak`)
- `POSTGRES_PASSWORD`: Database password (⚠️ **CHANGE THIS!**)

#### Admin Credentials
- `KEYCLOAK_ADMIN`: Admin username (default: `admin`)
- `KEYCLOAK_ADMIN_PASSWORD`: Admin password (⚠️ **CHANGE THIS!**)

#### Hostname Configuration
- `KC_HOSTNAME`: The hostname for Keycloak (default: `localhost`)
- `KC_HOSTNAME_STRICT`: Enable strict hostname validation
- `KC_HOSTNAME_STRICT_HTTPS`: Enable strict HTTPS validation

### Production Mode

For production, replace `command: start-dev` with `command: start` and configure proper SSL/TLS:

```yaml
keycloak:
  command: start
  environment:
    KC_HOSTNAME: your-domain.com
    KC_HOSTNAME_STRICT: true
    KC_HOSTNAME_STRICT_HTTPS: true
    KC_HTTPS_CERTIFICATE_FILE: /opt/keycloak/conf/server.crt.pem
    KC_HTTPS_CERTIFICATE_KEY_FILE: /opt/keycloak/conf/server.key.pem
  volumes:
    - ./certs/server.crt.pem:/opt/keycloak/conf/server.crt.pem
    - ./certs/server.key.pem:/opt/keycloak/conf/server.key.pem
```

## Basic Usage

### Create a Realm

1. Login to Admin Console
2. Hover over "Master" dropdown in top-left
3. Click "Create Realm"
4. Enter realm name and click "Create"

### Create a User

1. Select your realm
2. Go to Users → Add user
3. Fill in the user details
4. Click "Create"
5. Go to Credentials tab
6. Set password and toggle "Temporary" off

### Create a Client

1. Select your realm
2. Go to Clients → Create client
3. Enter Client ID
4. Select Client type (OpenID Connect, SAML, etc.)
5. Configure client settings
6. Save

## Health Checks

- **Health endpoint**: http://localhost:8080/health
- **Ready endpoint**: http://localhost:8080/health/ready
- **Live endpoint**: http://localhost:8080/health/live
- **Metrics endpoint**: http://localhost:8080/metrics

## Logs

View Keycloak logs:

```bash
docker-compose logs -f keycloak
```

View PostgreSQL logs:

```bash
docker-compose logs -f postgres
```

## Backup and Restore

### Backup Database

```bash
docker-compose exec postgres pg_dump -U keycloak keycloak > keycloak_backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U keycloak keycloak < keycloak_backup.sql
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs keycloak
```

### Can't connect to database

Ensure PostgreSQL is healthy:
```bash
docker-compose ps
docker-compose logs postgres
```

### Reset admin password

```bash
docker-compose exec keycloak /opt/keycloak/bin/kc.sh admin reset-password --username admin
```

## Security Recommendations

1. ⚠️ **Change default passwords** in production
2. Use strong passwords for admin and database
3. Enable HTTPS in production
4. Use proper hostname configuration
5. Regularly update Keycloak to latest version
6. Configure firewall rules appropriately
7. Enable audit logging
8. Use environment variables or secrets management

## Useful Commands

### Restart Keycloak

```bash
docker-compose restart keycloak
```

### Update to latest version

```bash
docker-compose pull
docker-compose up -d
```

### Access Keycloak CLI

```bash
docker-compose exec keycloak /opt/keycloak/bin/kc.sh
```

### Access PostgreSQL CLI

```bash
docker-compose exec postgres psql -U keycloak
```

## Integration Examples

### Spring Boot

Add dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

Configure in `application.yml`:
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          keycloak:
            client-id: your-client-id
            client-secret: your-client-secret
            scope: openid, profile, email
        provider:
          keycloak:
            issuer-uri: http://localhost:8080/realms/your-realm
```

### Node.js (Express)

```javascript
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());
```

## Documentation

- [Official Documentation](https://www.keycloak.org/documentation)
- [Server Administration Guide](https://www.keycloak.org/docs/latest/server_admin/)
- [Server Installation Guide](https://www.keycloak.org/docs/latest/server_installation/)
- [Docker Hub](https://quay.io/repository/keycloak/keycloak)

## License

Keycloak is licensed under the Apache License 2.0
