```
docker-compose up -d
```

## Backup and Restore
```sh
# Backup
docker exec -t postgres pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

# Restore
cat dump.sql | docker exec -i postgres psql -U postgres

# copy from container to host
docker cp postgres:/dump.sql dump.sql
```