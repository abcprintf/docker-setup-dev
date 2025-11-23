#!/bin/bash

# สคริปต์สำหรับแก้ไข PostgreSQL permissions สำหรับ Keycloak

echo "🔧 กำลังแก้ไข PostgreSQL permissions สำหรับ Keycloak..."

# ชื่อ container ของ PostgreSQL (แก้ไขตามของจริง)
POSTGRES_CONTAINER="postgres"

# Database และ user credentials
DB_NAME="keycloak"
DB_USER="keycloak"

echo ""
echo "📋 ขั้นตอนที่ 1: สร้าง database (ถ้ายังไม่มี)"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "✅ Database มีอยู่แล้ว"

echo ""
echo "📋 ขั้นตอนที่ 2: สร้าง user (ถ้ายังไม่มี)"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD 'password_change_me';" 2>/dev/null || echo "✅ User มีอยู่แล้ว"

echo ""
echo "📋 ขั้นตอนที่ 3: ให้สิทธิ์ database"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo ""
echo "📋 ขั้นตอนที่ 4: ให้สิทธิ์ schema public"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo ""
echo "📋 ขั้นตอนที่ 5: ให้สิทธิ์สร้าง table ใน schema public"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "GRANT CREATE ON SCHEMA public TO $DB_USER;"

echo ""
echo "📋 ขั้นตอนที่ 6: ตั้งค่า default privileges"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

echo ""
echo "📋 ขั้นตอนที่ 7: ตั้ง owner ของ schema public"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "ALTER SCHEMA public OWNER TO $DB_USER;"

echo ""
echo "✅ เรียบร้อย! ตรวจสอบสิทธิ์:"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c "SELECT schema_name, schema_owner FROM information_schema.schemata WHERE schema_name = 'public';"

echo ""
echo "🚀 ตอนนี้สามารถรัน Keycloak ได้แล้ว:"
echo "   docker-compose -f docker-compose.only.yml up -d"
