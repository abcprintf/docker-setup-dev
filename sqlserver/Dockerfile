# Dockerfile
# https://hub.docker.com/_/microsoft-mssql-server
FROM mcr.microsoft.com/mssql/server:2019-latest
EXPOSE 1433
WORKDIR /app
COPY ./entrypoint.sh ./
COPY ./init-db.sql ./
# https://dbafromthecold.com/2019/11/18/using-volumes-in-sql-server-2019-non-root-containers/
USER root
RUN chmod +x ./entrypoint.sh
RUN mkdir -p /var/opt/mssql/data && chown mssql /var/opt/mssql/data
RUN mkdir -p /var/opt/mssql/log && chown mssql /var/opt/mssql/log
RUN mkdir -p /var/opt/mssql/backup && chown mssql /var/opt/mssql/backup
USER mssql
ENTRYPOINT ["./entrypoint.sh"]