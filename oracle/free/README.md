## How to setup
```sh
docker compose up -d
```

## Connect to db
```sh
docker compose exec oracle-db bash

sqlplus system/<ORACLE_PWD>

// or

docker compose exec oracle-db sqlplus system/<ORACLE_PWD>
```