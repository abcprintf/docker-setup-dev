# Infisical - Open Source SecretOps Platform

Infisical is a modern, developer-friendly secret management platform that helps teams securely manage secrets across all environments and infrastructure.

## 🚀 Features

- **🔐 Secret Management**: Centrally manage secrets across all environments
- **👥 Team Collaboration**: Role-based access control and team management
- **🔄 CI/CD Integration**: Native integrations with popular CI/CD platforms
- **📱 Multiple Interfaces**: Web dashboard, CLI, and API access
- **🔒 End-to-End Encryption**: Zero-knowledge architecture
- **📊 Audit Logging**: Track all secret access and changes
- **🌐 Multi-Environment**: Dev, staging, and production environment support

## 📋 Prerequisites

- Docker and Docker Compose
- At least 2GB RAM
- Port 8088 available

## 🛠️ Installation & Setup

### 1. Start the Services

```bash
# Navigate to the infisical directory
cd infisical

# Start all services in production mode
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### 2. Access the Application

- **Web Interface**: http://localhost:8088
- **API Endpoint**: http://localhost:8088/api

### 3. Initial Setup

1. Open your browser and navigate to http://localhost:8088
2. Complete the initial setup wizard
3. Create your admin account
4. Start managing your secrets!

## 🔑 Default Credentials

For initial testing/development:

```
Email: admin@local.dev
Password: admin@123456789
```

> ⚠️ **Security Note**: Change these credentials immediately after first login in production environments.

## 🏗️ Architecture

### Services Overview

| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| **Backend** | infisical-backend | 8088:8080 | Main Infisical application |
| **Database** | infisical-db | Internal | PostgreSQL database |
| **Cache** | infisical-dev-redis | 6399:6379 | Redis for caching and sessions |

### Volumes

- `pg_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence

## ⚙️ Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# Core Settings
SITE_URL=http://localhost:8088
ENCRYPTION_KEY=your-encryption-key-here
AUTH_SECRET=your-auth-secret-here

# Database
POSTGRES_USER=infisical
POSTGRES_PASSWORD=infisical
POSTGRES_DB=infisical

# Redis
REDIS_URL=redis://redis:6379

# SMTP (Optional - for email notifications)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_FROM_ADDRESS=noreply@yourcompany.com
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### Production Configuration

For production deployments:

1. **Generate secure keys**:
   ```bash
   # Generate encryption key
   openssl rand -hex 32
   
   # Generate auth secret
   openssl rand -base64 32
   ```

2. **Update environment variables** with your production values

3. **Configure SMTP** for email notifications

4. **Set up proper domain** and SSL certificates

## 🔧 Management Commands

### Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Update to Latest Version
```bash
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Backup Database
```bash
docker exec infisical-db pg_dump -U infisical infisical > backup.sql
```

### Restore Database
```bash
docker exec -i infisical-db psql -U infisical infisical < backup.sql
```

## 🌟 Usage Examples

### Creating Your First Secret

1. **Login** to the web interface
2. **Create a Project** for your application
3. **Add Secrets** with key-value pairs:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   API_KEY=your-api-key-here
   JWT_SECRET=your-jwt-secret
   ```

### Environment Management

- **Development**: Store dev credentials and debug settings
- **Staging**: Mirror production but with staging-specific values
- **Production**: Store production secrets with restricted access

### Team Collaboration

1. **Invite team members** via email
2. **Assign roles**: Admin, Developer, Viewer
3. **Set environment permissions** per user
4. **Track changes** via audit logs

## 🔗 Integrations

Infisical supports integration with:

- **CI/CD**: GitHub Actions, GitLab CI, Jenkins
- **Cloud Providers**: AWS, Google Cloud, Azure
- **Frameworks**: Node.js, Python, Go, Java
- **Platforms**: Kubernetes, Docker, Heroku, Vercel

## 🛡️ Security Best Practices

1. **Change default credentials** immediately
2. **Use strong encryption keys** for production
3. **Enable HTTPS** with proper SSL certificates
4. **Regular backups** of database
5. **Monitor audit logs** for suspicious activity
6. **Limit user permissions** to minimum required
7. **Keep Infisical updated** to latest version

## 🔍 Troubleshooting

### Common Issues

**Service won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Verify environment variables
docker-compose -f docker-compose.prod.yml config
```

**Database connection issues:**
```bash
# Check database health
docker-compose -f docker-compose.prod.yml exec db pg_isready -U infisical

# Reset database
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

**Port conflicts:**
```bash
# Check what's using port 8088
lsof -i :8088

# Use different port in docker-compose.yml
ports:
  - 8089:8080  # Change external port
```

## 📚 Additional Resources

- **Official Documentation**: https://infisical.com/docs
- **GitHub Repository**: https://github.com/Infisical/infisical
- **Community Discord**: https://infisical.com/discord
- **CLI Tool**: https://infisical.com/docs/cli/overview

## 🤝 Support

For issues and questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search [GitHub Issues](https://github.com/Infisical/infisical/issues)
3. Join the [Discord community](https://infisical.com/discord)
4. Review the [official documentation](https://infisical.com/docs)

---

> 💡 **Tip**: Start with development environment and gradually migrate to production with proper security configurations.