[English](README.md) | [ภาษาไทย](README_TH.md)

# new-docker-setup

## Project Folder Structure
## Overview

This project is a collection of various tools and services, each running in its own container using Docker and Docker Compose. It is designed to help you quickly set up, test, and manage multiple open-source applications and infrastructure components in a consistent, isolated environment. Each folder contains a ready-to-use Docker setup for a specific tool or service.

You can start, stop, and manage these services independently, making it easy to experiment or deploy in development environments.

## Service Descriptions

| Folder                | Service/Tool         | Description |
|-----------------------|----------------------|-------------|
| apache-tika-server    | Apache Tika Server   | Document text extraction and metadata parsing |
| bookstack             | BookStack            | Wiki and knowledge management platform |
| chat2db               | Chat2DB              | Database management and query tool |
| elasticsearch         | Elasticsearch Stack  | Search engine and analytics platform |
| ferretdb              | FerretDB             | MongoDB-compatible database using PostgreSQL |
| hashicorp-vault       | HashiCorp Vault      | Secrets management and encryption |
| infisical             | Infisical            | Secret management for developers |
| jenkins               | Jenkins              | Automation server for CI/CD |
| jsreport              | jsreport             | Reporting platform for generating PDFs, etc. |
| jsoncrack             | JSON Crack           | Visual JSON data explorer and editor |
| kong                  | Kong                 | API gateway and management |
| minio                 | MinIO                | High-performance object storage (S3 compatible) |
| mongodb               | MongoDB              | NoSQL document database |
| mysql                 | MySQL                | Relational database server |
| n8n                   | n8n                  | Workflow automation tool |
| neko                  | Neko                 | Virtual browser streaming service |
| nextcloud             | Nextcloud            | File sharing and collaboration platform |
| nginx                 | Nginx                | Web server and reverse proxy |
| nginxproxymanager     | Nginx Proxy Manager  | UI for managing Nginx proxy hosts |
| onlyoffice            | OnlyOffice           | Online document editing suite |
| openldap              | OpenLDAP             | LDAP directory server |
| oracle                | Oracle Database      | Relational database server |
| owncloud              | ownCloud             | File sharing and collaboration platform |
| paperless-ngx         | Paperless-ngx        | Document management system |
| portainer             | Portainer            | Docker container management UI |
| postgres              | PostgreSQL           | Relational database server |
| postgres-pgvector     | PostgreSQL + pgvector| PostgreSQL with vector search extension |
| prometheus-grafana    | Prometheus & Grafana | Monitoring and visualization tools |
| rabbitMQ              | RabbitMQ             | Message broker (AMQP) |
| redis-server          | Redis                | In-memory key-value store |
| RocketChat            | Rocket.Chat          | Team chat and collaboration platform |
| scylladb              | ScyllaDB             | High-performance NoSQL database |
| seafile               | Seafile              | File hosting and sharing platform |
| sonarqube             | SonarQube            | Code quality and security analysis |
| sqlserver             | SQL Server           | Microsoft SQL Server database |
| stirlingpdf           | Stirling PDF         | PDF manipulation toolkit |
| test-myapp            | Test MyApp           | Example/test application setup |
| uptime-kuma           | Uptime Kuma          | Self-hosted monitoring tool |
| webcheck              | WebCheck             | Website status checker |
| windows               | Windows              | Windows-related resources or images |

```
apache-tika-server/
bookstack/
chat2db/
elasticsearch/
ferretdb/
hashicorp-vault/
infisical/
jenkins/
jsreport/
jsoncrack/
kong/
minio/
mongodb/
mysql/
n8n/
neko/
nextcloud/
nginx/
nginxproxymanager/
onlyoffice/
openldap/
oracle/
owncloud/
paperless-ngx/
portainer/
postgres/
postgres-pgvector/
prometheus-grafana/
rabbitMQ/
redis-server/
RocketChat/
scylladb/
seafile/
sonarqube/
sqlserver/
stirlingpdf/
test-myapp/
uptime-kuma/
webcheck/
windows/
```

## Adding or Modifying a Service

To add a new service or update an existing one, follow these guidelines:

1. **Create a new folder** in the root directory with a clear, descriptive name for your service (e.g., `myservice/`).
2. **Add a `docker-compose.yml`** (or `Dockerfile` if needed) inside the new folder. Use existing folders as examples for structure and best practices.
3. **Include a `README.md`** in the service folder to describe its purpose, usage, and any special configuration or environment variables.
4. **Keep configuration files and persistent data** (such as volumes or database files) inside subfolders (e.g., `data/`, `config/`, etc.) to keep things organized.
5. **Update the main `README.md`**:
	- Add the new folder name to the Project Folder Structure list.
	- Add a short description to the Service Descriptions table.
6. **Use lowercase and hyphens** for folder and file names for consistency (e.g., `my-new-service/`).
7. **Test your service** by running `docker-compose up` in the new folder and ensure it works as expected.
8. **(Optional) Add environment example files** (e.g., `.env.example`) if your service requires environment variables.

By following these conventions, the project will remain organized and easy to maintain.

## Working with Git Submodules

This project uses Git submodules to include external repositories. Submodules allow us to keep external projects as separate repositories while including them in our main project.

### What is a Submodule?

A Git submodule is a repository embedded inside another repository. It maintains its own history and can be updated independently. In this project, we use submodules for services that have their own upstream repositories (e.g., `jsoncrack`).

### Initial Setup (First Time Clone)

If you're cloning this repository for the first time and want to include all submodules:

```bash
# Clone with all submodules
git clone --recurse-submodules https://github.com/abcprintf/docker-setup-dev.git

# OR if you already cloned without submodules
git clone https://github.com/abcprintf/docker-setup-dev.git
cd docker-setup-dev
git submodule init
git submodule update
```

### Adding a New Submodule

To add a new external repository as a submodule:

```bash
# Add submodule
git submodule add <repository-url> <folder-name>

# Example:
git submodule add https://github.com/AykutSarac/jsoncrack.com.git jsoncrack

# Commit the changes
git add .gitmodules <folder-name>
git commit -m "Add <service-name> submodule"
git push
```

### Updating Submodules

To update a submodule to the latest version from its repository:

```bash
# Update specific submodule to latest
cd <submodule-folder>
git pull origin main  # or master, depending on the branch

# Go back to main project and commit the update
cd ..
git add <submodule-folder>
git commit -m "Update <submodule-name> to latest version"
git push
```

Or update all submodules at once:

```bash
# Update all submodules to their latest commits
git submodule update --remote --merge

# Commit the updates
git add .
git commit -m "Update all submodules"
git push
```

### Checking Submodule Status

```bash
# View submodule status
git submodule status

# View submodule configuration
cat .gitmodules
```

### Removing a Submodule

If you need to remove a submodule:

```bash
# Remove the submodule entry from .git/config
git submodule deinit -f <submodule-folder>

# Remove the submodule from the working tree and .git/modules
git rm -f <submodule-folder>

# Commit the changes
git commit -m "Remove <submodule-name> submodule"
git push
```

### Common Submodule Issues

**Issue: Submodule folder is empty after clone**
```bash
git submodule init
git submodule update
```

**Issue: Detached HEAD in submodule**
```bash
cd <submodule-folder>
git checkout main  # or the branch you want
cd ..
```

**Issue: Submodule changes not tracked**
- Submodules are tracked as specific commits, not branches
- After updating inside a submodule, return to the parent repository and commit the change

### Best Practices

1. **Always commit submodule updates** in the parent repository after updating the submodule
2. **Document which branch** each submodule should track (usually `main` or `master`)
3. **Communicate with team** when updating submodules to avoid conflicts
4. **Use `--recurse-submodules`** flag when cloning to automatically initialize submodules
5. **Check submodule status** regularly with `git submodule status`

## Contributing & Reporting Issues

### How to Contribute

1. Fork this repository and create a new branch for your changes.
2. Make your changes following the project conventions.
3. Test your changes to ensure they work as expected.
4. Submit a Pull Request (PR) to the `main` branch with a clear description of your changes and the reason for them.
5. Wait for review and feedback.

### Reporting Issues

If you find a bug or have a feature request, please open an issue in the GitHub repository with as much detail as possible (steps to reproduce, logs, screenshots, etc.).

### Contact

For questions or further discussion, please use the GitHub Issues or Pull Request comments. You can also contact the repository owner directly via GitHub: [abcprintf](https://github.com/abcprintf)
```
