## Setup Seafile Server
```bash
cp .env.example .env

docker-compose up -d
```

```bash
sudo docker exec -it seafile bash
vi /shared/seafile/conf/seahub_settings.py
```
```python
SERVICE_URL = "https://sf.abcprintf.dev"
CSRF_TRUSTED_ORIGINS = ['http://sf.abcprintf.dev', 'https://sf.abcprintf.dev']
DEBUG=True

TIME_ZONE = 'Asia/Bangkok'
FILE_SERVER_ROOT = "https://sf.abcprintf.dev/seafhttp"
```