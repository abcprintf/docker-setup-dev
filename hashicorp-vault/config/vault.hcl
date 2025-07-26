# Vault Configuration File

# Storage backend
storage "file" {
  path = "/vault/data"
}

# HTTP listener
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = true
}

# UI
ui = true

# Disable memory locking
disable_mlock = true

# API address
api_addr = "http://0.0.0.0:8200"

# Cluster address
cluster_addr = "http://0.0.0.0:8201"

# Log level
log_level = "Info"

# PID file
pid_file = "/vault/logs/vault.pid"
