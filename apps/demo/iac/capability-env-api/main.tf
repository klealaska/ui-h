
# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

provider "azapi" {
}

# Data Blocks
data "azurerm_client_config" "current" {}


data "terraform_remote_state" "capability_workspace" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.capability_workspace_name
    }
  }
}
data "terraform_remote_state" "capability_env_workspace" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.capability_env_workspace_name
    }
  }
}

resource "azurerm_app_service_plan" "service_plan" {
  name                = var.app_service_plan
  location            = var.location
  resource_group_name = data.terraform_remote_state.capability_env_workspace.outputs.resource_group_name

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_web_pubsub" "pubsub" {
  name                = lower("${var.pubsub_name}-${var.environment}")
  location            = var.location
  resource_group_name = data.terraform_remote_state.capability_env_workspace.outputs.resource_group_name

  sku      = "Standard_S1"
  capacity = 1

  public_network_access_enabled = true

  live_trace {
    enabled                   = true
    messaging_logs_enabled    = true
    connectivity_logs_enabled = false
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_function_app" "function_app" {
  name                       = lower("${var.function_app_name}-${var.environment}")
  location                   = var.location
  resource_group_name        = data.terraform_remote_state.capability_env_workspace.outputs.resource_group_name
  app_service_plan_id        = azurerm_app_service_plan.service_plan.id
  storage_account_name       = data.terraform_remote_state.capability_env_workspace.outputs.storage_account_name
  storage_account_access_key = data.terraform_remote_state.capability_env_workspace.outputs.storage_account_access_key
  version                    = "~4"
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"     = "node"
    "FUNCTIONS_EXTENSION_VERSION"  = "~4"
    "WEBSITE_NODE_DEFAULT_VERSION" = "~16"
    "WEBSITE_RUN_FROM_PACKAGE"     = "1"
  }

  site_config {
    cors {
      allowed_origins = ["*"]
    }
  }
  connection_string {
    name  = "WebPubSubConnectionString"
    type  = "MySql"
    value = azurerm_web_pubsub.pubsub.primary_connection_string
  }
}

#Finish implementing this later
resource "azurerm_web_pubsub_hub" "pubsub_hub" {
  name          = "zombie_dice"
  web_pubsub_id = azurerm_web_pubsub.pubsub.id
  event_handler {
    url_template = "https://${azurerm_function_app.function_app.default_hostname}/runtime/webhooks/webpubsub?code=${azurerm_web_pubsub.pubsub.primary_connection_string}"
    # system_events = ["connect", "connected"]
  }

  # event_handler {
  #   url_template       = "https://test.com/api/{hub}/{event}"
  #   user_event_pattern = "event1, event2"
  #   system_events      = ["connected"]
  #   # auth {
  #   #   managed_identity_id = azurerm_user_assigned_identity..id
  #   # }
  # }
  anonymous_connections_enabled = true

  depends_on = [
    azurerm_web_pubsub.pubsub
  ]
}


resource "azurerm_log_analytics_workspace" "analytics" {
  name                = lower("demo-zombie-dice-api-${var.environment}")
  location            = var.location
  resource_group_name = data.terraform_remote_state.capability_env_workspace.outputs.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}
