# Vault Configuration File
# ตั้งค่าสำหรับ production mode with file storage

# Storage backend - ใช้ file system แทน memory
storage "file" {
  path = "/vault/data"
}

# Listener configuration
listener "tcp" {
  address     = "0.0.0.0:8201"
  tls_disable = true
}

# API and Cluster addresses
api_addr = "http://0.0.0.0:8201"
cluster_addr = "https://0.0.0.0:8202"

# UI configuration
ui = true

# Disable mlock for development (อนุญาตให้ swap memory ได้)
disable_mlock = true

# Default lease TTL
default_lease_ttl = "168h"  # 7 days
max_lease_ttl = "720h"      # 30 days

# Log level
log_level = "INFO"

# Plugin directory
plugin_directory = "/vault/plugins"

# Enable raw endpoint for health checks
raw_storage_endpoint = true
