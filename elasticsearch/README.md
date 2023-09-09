## How to setup
```sh

// start
docker-compose up -d
docker compose up -d --force-recreate

// shutdown
docker compose down


docker compose  -f "elasticsearch\docker-compose.yml" up -d --force-recreate --build [es-app, fb-app]
```