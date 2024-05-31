## Mongodb 7.0

## Run
```sh
docker compose up -d

// run init-mongo.sh
docker exec -it mongodb_version_70 bash
./init-mongo.sh

// run mongo shell
mongosh -u root -p root --authenticationDatabase admin

// create new user
use admin
db.createUser(
  {
    user: "devmix",
    pwd: "devmix12345",
    roles: [ { role: "readWrite", db: "new_db" } ]
  }
)

// grant roles
use admin
db.grantRolesToUser(
    "devmix",
    [
        { role: "readWriteAnyDatabase", db: "admin" }
    ]
)
```