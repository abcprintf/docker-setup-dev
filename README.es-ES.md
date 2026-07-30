

[Inglés](README.md) | [Español](README_ES.md)

# new-docker-setup

## Estructura de Carpetas del Proyecto
## Resumen

Este proyecto es una colección de diversas herramientas y servicios, cada uno ejecutándose en su propio contenedor utilizando Docker y Docker Compose. Está diseñado para ayudarte a configurar, probar y administrar rápidamente múltiples aplicaciones de código abierto y componentes de infraestructura en un entorno consistente e aislado. Cada carpeta contiene una configuración de Docker lista para usar para una herramienta o servicio específico.

Puedes iniciar, detener y administrar estos servicios de forma independiente, lo que facilita experimentar o desplegarlos en entornos de desarrollo.

## Descripción de Servicios

| Carpeta                | Servicio/Herramienta         | Descripción |
|-----------------------|----------------------|-------------|
| apache-tika-server    | Apache Tika Server   | Extracción de texto de documentos y análisis de metadatos |
| bookstack             | BookStack            | Plataforma de wiki y gestión del conocimiento |
| chat2db               | Chat2DB              | Herramienta de gestión y consultas de bases de datos |
| elasticsearch         | Elasticsearch Stack  | Motor de búsqueda y plataforma de análisis |
| ferretdb              | FerretDB             | Base de datos compatible con MongoDB que utiliza PostgreSQL |
| hashicorp-vault       | HashiCorp Vault      | Gestión de secretos y cifrado |
| infisical             | Infisical            | Gestión de secretos para desarrolladores |
| jenkins               | Jenkins              | Servidor de automatización para CI/CD |
| jsreport              | jsreport             | Plataforma de informes para generar PDF, etc. |
| jsoncrack             | JSON Crack           | Explorador y editor visual de datos JSON |
| kong                  | Kong                 | Puerta de enlace y gestión de API |
| minio                 | MinIO                | Almacenamiento de objetos de alto rendimiento (compatible con S3) |
| mongodb               | MongoDB              | Base de datos documental NoSQL |
| mysql                 | MySQL                | Servidor de base de datos relacional |
| n8n                   | n8n                  | Herramienta de automatización de flujos de trabajo |
| neko                  | Neko                 | Servicio de transmisión de navegador virtual |
| nextcloud             | Nextcloud            | Plataforma de intercambio y colaboración de archivos |
| nginx                 | Nginx                | Servidor web y proxy inverso |
| nginxproxymanager     | Nginx Proxy Manager  | Interfaz de usuario para gestionar hosts proxy de Nginx |
| onlyoffice            | OnlyOffice           | Suite de edición de documentos en línea |
| openldap              | OpenLDAP             | Servidor de directorio LDAP |
| oracle                | Oracle Database      | Servidor de base de datos relacional |
| owncloud              | ownCloud             | Plataforma de intercambio y colaboración de archivos |
| paperless-ngx         | Paperless-ngx        | Sistema de gestión documental |
| portainer             | Portainer            | Interfaz de usuario para la gestión de contenedores Docker |
| postgres              | PostgreSQL           | Servidor de base de datos relacional |
| postgres-pgvector     | PostgreSQL + pgvector| PostgreSQL con extensión de búsqueda vectorial |
| prometheus-grafana    | Prometheus & Grafana | Herramientas de monitorización y visualización |
| rabbitMQ              | RabbitMQ             | Corredor de mensajes (AMQP) |
| redis-server          | Redis                | Almacén clave-valor en memoria |
| RocketChat            | Rocket.Chat          | Plataforma de chat y colaboración para equipos |
| scylladb              | ScyllaDB             | Base de datos NoSQL de alto rendimiento |
| seafile               | Seafile              | Plataforma de alojamiento e intercambio de archivos |
| sonarqube             | SonarQube            | Análisis de calidad y seguridad del código |
| sqlserver             | SQL Server           | Base de datos Microsoft SQL Server |
| stirlingpdf           | Stirling PDF         | Kit de herramientas para manipulación de PDF |
| test-myapp            | Test MyApp           | Configuración de aplicación de ejemplo/prueba |
| uptime-kuma           | Uptime Kuma          | Herramienta de monitorización autoalojada |
| webcheck              | WebCheck             | Verificador de estado de sitios web |
| windows               | Windows              | Recursos o imágenes relacionados con Windows |

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

## Añadir o Modificar un Servicio

Para añadir un nuevo servicio o actualizar uno existente, sigue estas directrices:

1. **Crea una nueva carpeta** en el directorio raíz con un nombre claro y descriptivo para tu servicio (por ejemplo, `myservice/`).
2. **Añade un `docker-compose.yml`** (o `Dockerfile` si es necesario) dentro de la nueva carpeta. Utiliza las carpetas existentes como ejemplos de estructura y buenas prácticas.
3. **Incluye un `README.md`** en la carpeta del servicio para describir su propósito, uso y cualquier configuración especial o variables de entorno.
4. **Mantén los archivos de configuración y los datos persistentes** (como volúmenes o archivos de base de datos) dentro de subcarpetas (por ejemplo, `data/`, `config/`, etc.) para mantener las cosas organizadas.
5. **Actualiza el `README.md` principal**:
	- Añade el nombre de la nueva carpeta a la lista de Estructura de Carpetas del Proyecto.
	- Añade una breve descripción a la tabla de Descripción de Servicios.
6. **Usa minúsculas y guiones** para los nombres de carpetas y archivos para mantener la consistencia (por ejemplo, `my-new-service/`).
7. **Prueba tu servicio** ejecutando `docker-compose up` en la nueva carpeta y asegúrate de que funcione como se espera.
8. **(Opcional) Añade archivos de ejemplo de entorno** (por ejemplo, `.env.example`) si tu servicio requiere variables de entorno.

Al seguir estas convenciones, el proyecto se mantendrá organizado y fácil de mantener.

## Trabajar con Submódulos de Git

Este proyecto utiliza submódulos de Git para incluir repositorios externos. Los submódulos nos permiten mantener proyectos externos como repositorios independientes mientras los incluimos en nuestro proyecto principal.

### ¿Qué es un submódulo?

Un submódulo de Git es un repositorio incrustado dentro de otro repositorio. Mantiene su propio historial y puede actualizarse de forma independiente. En este proyecto, utilizamos submódulos para servicios que tienen sus propios repositorios principales (por ejemplo, `jsoncrack`).

### Configuración Inicial (Primer Clonado)

Si estás clonando este repositorio por primera vez y deseas incluir todos los submódulos:

```bash
# Clonar con todos los submódulos
git clone --recurse-submodules https://github.com/abcprintf/docker-setup-dev.git

# O si ya clonaste sin submódulos
git clone https://github.com/abcprintf/docker-setup-dev.git
cd docker-setup-dev
git submodule init
git submodule update
```

### Añadir un Nuevo Submódulo

Para añadir un nuevo repositorio externo como submódulo:

```bash
# Añadir submódulo
git submodule add <repository-url> <folder-name>

# Ejemplo:
git submodule add https://github.com/AykutSarac/jsoncrack.com.git jsoncrack

# Confirmar los cambios
git add .gitmodules <folder-name>
git commit -m "Add <service-name> submodule"
git push
```

### Actualizar Submódulos

Para actualizar un submódulo a la última versión desde su repositorio:

```bash
# Actualizar submódulo específico a la última versión
cd <submodule-folder>
git pull origin main  # o master, dependiendo de la rama

# Volver al proyecto principal y confirmar la actualización
cd ..
git add <submodule-folder>
git commit -m "Update <submodule-name> to latest version"
git push
```

O actualizar todos los submódulos a la vez:

```bash
# Actualizar todos los submódulos a sus commits más recientes
git submodule update --remote --merge

# Confirmar las actualizaciones
git add .
git commit -m "Update all submodules"
git push
```

### Verificar el Estado de los Submódulos

```bash
# Ver estado de los submódulos
git submodule status

# Ver configuración de los submódulos
cat .gitmodules
```

### Eliminar un Submódulo

Si necesitas eliminar un submódulo:

```bash
# Eliminar la entrada del submódulo de .git/config
git submodule deinit -f <submodule-folder>

# Eliminar el submódulo del árbol de trabajo y de .git/modules
git rm -f <submodule-folder>

# Confirmar los cambios
git commit -m "Remove <submodule-name> submodule"
git push
```

### Problemas Comunes con Submódulos

**Problema: La carpeta del submódulo está vacía después del clonado**
```bash
git submodule init
git submodule update
```

**Problema: HEAD desvinculado en el submódulo**
```bash
cd <submodule-folder>
git checkout main  # o la rama que desees
cd ..
```

**Problema: Los cambios del submódulo no se registran**
- Los submódulos se registran como commits específicos, no como ramas
- Después de actualizar dentro de un submódulo, regresa al repositorio principal y confirma el cambio

### Mejores Prácticas

1. **Confirma siempre las actualizaciones de submódulos** en el repositorio principal después de actualizar el submódulo
2. **Documenta qué rama** debe seguir cada submódulo (normalmente `main` o `master`)
3. **Comunícate con el equipo** al actualizar submódulos para evitar conflictos
4. **Usa la bandera `--recurse-submodules`** al clonar para inicializar automáticamente los submódulos
5. **Verifica el estado de los submódulos** regularmente con `git submodule status`

## Contribuir y Reportar Problemas

### Cómo Contribuir

1. Haz un fork de este repositorio y crea una nueva rama para tus cambios.
2. Realiza tus cambios siguiendo las convenciones del proyecto.
3. Prueba tus cambios para asegurarte de que funcionen como se espera.
4. Envía una Pull Request (PR) a la rama `main` con una descripción clara de tus cambios y la razón de los mismos.
5. Espera la revisión y los comentarios.

### Reportar Problemas

Si encuentras un error o tienes una solicitud de funcionalidad, abre un issue en el repositorio de GitHub con el mayor detalle posible (pasos para reproducir, registros, capturas de pantalla, etc.).

### Contacto

Para preguntas o discusiones adicionales, utiliza los Issues de GitHub o los comentarios de las Pull Requests. También puedes contactar directamente al propietario del repositorio a través de GitHub: [abcprintf](https://github.com/abcprintf)
```
