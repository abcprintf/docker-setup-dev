# Setup Replica Set
```sh
// connect to primary
mongosh.exe --port 30001

// initiate replica set
config={_id:"rs0", members:[{_id:0,host:"mongo1:30001"}, {_id:1,host:"mongo2:30002"}, {_id:2,host:"mongo3:30003"}]}

rs.initiate(config)

show dbs

use rs0
db.users.insert({name: "devmix"})
```

# Connect secondary
```sh
// connect to secondary : 30002
mongosh.exe --port 30002
show dbs
use rs0
db.users.find() // Error
rs.secondaryOk() // allow read from secondary

// connect to secondary : 30002
mongosh.exe --port 30002
show dbs
use rs0
db.users.find() // Error
rs.secondaryOk() // allow read from secondary
```

# Connect Replica Set
```sh
ongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0
```