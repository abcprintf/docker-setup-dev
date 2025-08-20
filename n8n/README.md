# n8n Self-Hosted Setup

This guide explains how to set up n8n using Docker Compose for self-hosted automation workflows.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

1. **Clone this repository** (if you haven't already):
   ```sh
   git clone <your-repo-url>
   cd docker-setup-dev/n8n
   ```

2. **Start n8n with Docker Compose:**
   ```sh
   docker-compose up -d
   ```

3. **Access n8n:**
   - Open your browser and go to: [http://localhost:5678](http://localhost:5678)
   - Default credentials (change in `docker-compose.yml` for production):
     - **Username:** admin
     - **Password:** admin

4. **Persisted Data:**
   - All n8n data is stored in the Docker volume `n8n_data` (mounted to `/home/node/.n8n` in the container).

## Customization
- To change authentication, ports, or other settings, edit the `docker-compose.yml` file.
- For production, set strong credentials and consider using HTTPS.

## Stopping n8n
```sh
docker-compose down
```

## Updating n8n
```sh
docker-compose pull
docker-compose up -d
```

## More Information
- [n8n Documentation](https://docs.n8n.io/)
