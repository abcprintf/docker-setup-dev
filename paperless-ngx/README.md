## Paperless-NGX Docker Setup
```bash
bash -c "$(curl --location --silent --show-error https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/main/install-paperless-ngx.sh)"
```

## Run Paperless-NGX
```bash
docker compose up -d
```

## update hosts file
```bash
sudo nano /etc/hosts

# Add the following line
127.0.0.1 paperless-ngx.local