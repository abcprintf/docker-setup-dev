## How to setup
```sh
docker compose up

docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v data:/data portainer/portainer
```

## Open URL
[http://localhost:9000](http://localhost:9000)