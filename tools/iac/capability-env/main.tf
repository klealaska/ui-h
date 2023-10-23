terraform {
  backend "remote" {}
}

# Configure the Microsoft Azure Provider

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
  skip_provider_registration = true
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
  skip_provider_registration = true
  alias                      = "hub_subscription"
  subscription_id            = "f4d2e617-aaed-4636-a6b2-b030cf0dc847" // AvidXchange Enterprise PRODUCTION
}

provider "azapi" {
}

# Data Blocks
data "azurerm_client_config" "current" {}

data "azurerm_key_vault" "hub_key_vault" {
  count = var.container_app_required ? 1 : 0

  provider = azurerm.hub_subscription

  name                = "Ax-Ae1-Hub-Kv"
  resource_group_name = "Ax-Ae1-Hub-SharedPlatform-Rg"
}

data "azurerm_application_insights" "application_insights" {
  name                = "Ax-${var.location == "eastus" ? "Ae1" : "Aw1"}-${var.is_production ? "Uicoe" : "UicoeNp"}-${var.environment}-Shared-Resources-Insights"
  resource_group_name = "Ax-${var.location == "eastus" ? "Ae1" : "Aw1"}-${var.is_production ? "Uicoe" : "UicoeNp"}-${var.environment}-Shared-Resources-Rg"
}

data "azurerm_key_vault_secret" "hub_acr_username" {
  count = var.container_app_required ? 1 : 0

  provider = azurerm.hub_subscription

  name         = "acrUser"
  key_vault_id = data.azurerm_key_vault.hub_key_vault[0].id
}

data "azurerm_key_vault_secret" "hub_acr_password" {
  count = var.container_app_required ? 1 : 0

  provider = azurerm.hub_subscription

  name         = "acrPw"
  key_vault_id = data.azurerm_key_vault.hub_key_vault[0].id
}

data "terraform_remote_state" "capability_workspace" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.workspace_name
    }
  }
}

data "terraform_remote_state" "capability_env_shared_workspace" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.shared_env_workspace_name
    }
  }
}

# Set Local Vars:
####################################

locals {
  domain_name_short = var.domain.abbrev
}

# Capability-Environment Resource Naming Prefix
module "azure_resourcename" {
  source  = "app.terraform.io/avidxchange/azure-resourcename/avid"
  version = "~> 1.0.0"

  scope         = var.scope
  domain        = var.domain
  capability    = var.capability
  environment   = var.environment
  is_production = var.is_production
  location      = var.location
}

# Resource Group
module "resourcegroup" {
  source  = "app.terraform.io/avidxchange/azure-resourcegroup/avid"
  version = "~> 2.0.0"

  scope         = var.scope
  domain        = var.domain
  capability    = var.capability
  environment   = var.environment
  is_production = var.is_production
  location      = var.location
}

# Application Insights
module "appinsights" {
  source  = "app.terraform.io/avidxchange/azure-appinsights/avid"
  version = "~> 2.0.0"

  scope               = var.scope
  domain              = var.domain
  capability          = var.capability
  environment         = var.environment
  is_production       = var.is_production
  location            = module.resourcegroup.location
  resource_group_name = module.resourcegroup.name
}


# Log Analytics Workspace
module "loganalytics" {
  source  = "app.terraform.io/avidxchange/azure-loganalytics/avid"
  version = "~> 2.0.0"

  scope               = var.scope
  domain              = var.domain
  capability          = var.capability
  environment         = var.environment
  is_production       = var.is_production
  location            = module.resourcegroup.location
  resource_group_name = module.resourcegroup.name
}


# Key Vault
module "keyvault" {
  source  = "app.terraform.io/avidxchange/azure-keyvault/avid"
  version = "~> 2.0.0"

  domain                     = var.domain
  capability                 = var.capability
  scope                      = var.scope
  environment                = var.environment
  is_production              = var.is_production
  location                   = module.resourcegroup.location
  resource_group_name        = module.resourcegroup.name
  log_analytics_workspace_id = module.loganalytics.id
}

# Key Vault Access Policy
resource "azurerm_key_vault_access_policy" "spn_access_policy" {
  key_vault_id = module.keyvault.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Purge",
  ]
}

resource "azurerm_key_vault_access_policy" "global_reader_access_policy" {
  key_vault_id = module.keyvault.id
  tenant_id    = azurerm_user_assigned_identity.global_reader.tenant_id
  object_id    = azurerm_user_assigned_identity.global_reader.principal_id

  secret_permissions = [
    "Get",
    "List",
  ]
}

# User Assigned Identities
resource "azurerm_user_assigned_identity" "global_reader" {
  resource_group_name = module.resourcegroup.name
  location            = module.resourcegroup.location

  name = "${var.environment}-${var.capability.name}-Global-Reader-Id"

  tags = {
    Capability = var.capability.name,
    Domain     = var.domain.name

  }
}

resource "azurerm_user_assigned_identity" "global_writer" {
  resource_group_name = module.resourcegroup.name
  location            = module.resourcegroup.location

  name = "${var.environment}-${var.capability.name}-Global-Writer-Id"

  tags = {
    Capability = var.capability.name
    Domain     = var.domain.name

  }
}

# Blob Storage for SPA Storage
resource "azurerm_storage_account" "storage_account" {
  name                     = lower("${var.application_name}${var.environment}${var.location}")
  resource_group_name      = module.resourcegroup.name
  location                 = module.resourcegroup.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET"]
      allowed_origins    = ["*"]
      exposed_headers    = [""]
      max_age_in_seconds = 0
    }
  }

  network_rules {
    default_action = "Allow"
    ip_rules       = ["147.243.0.0/16"]
    bypass         = ["Metrics", "Logging"]
  }

  tags = {
    Capability = var.capability.name
    Domain     = var.domain.name
  }
}

resource "azurerm_key_vault_secret" "storage_key" {
  name         = lower("storage-key-${var.environment}")
  value        = azurerm_storage_account.storage_account.primary_access_key
  key_vault_id = module.keyvault.id

  depends_on = [
    azurerm_key_vault_access_policy.spn_access_policy,
  ]
}

# resource "azapi_resource" "container_app" {
#   count     = var.container_app_required ? 1 : 0
#   name      = lower("${var.container_app_name}-${var.environment}-deprecated")
#   location  = module.resourcegroup.location
#   parent_id = module.resourcegroup.id
#   type      = "Microsoft.App/containerApps@2022-10-01"
#   body = jsonencode({
#     properties = {
#       managedEnvironmentId = data.terraform_remote_state.capability_env_shared_workspace.outputs.container_app_environment_id
#       configuration = {
#         ingress = {
#           targetPort = 3333
#           external   = true
#           ipSecurityRestrictions = [
#             {
#               name : "Front Door",
#               ipAddressRange : "147.243.0.0/16",
#               action : "Allow"
#             }
#           ],
#         },
#         registries = [
#           {
#             passwordSecretRef = lower(data.azurerm_key_vault_secret.hub_acr_password[0].name)
#             server            = var.acr_server
#             username          = data.azurerm_key_vault_secret.hub_acr_username[0].value
#           }
#         ],
#         secrets : [
#           {
#             name  = lower(data.azurerm_key_vault_secret.hub_acr_password[0].name)
#             value = data.azurerm_key_vault_secret.hub_acr_password[0].value
#           }
#         ]
#       },
#       template = {
#         containers = [
#           {
#             // image = lower("${var.container_image_name}-${var.environment}")
#             image = "axglbhubacr.azurecr.io/shell-bff:latest-dv" // Use placeholder image for initial deployment
#             name  = lower("${var.container_app_name}-${var.environment}")
#           }
#         ],
#         scale = {
#           minReplicas = 1
#           maxReplicas = 2
#         }
#       }
#     }
#   })
#   ignore_missing_property = true
#   response_export_values  = ["properties.configuration.ingress.fqdn", "id"]
# }


resource "azurerm_container_app" "container_app_internal" {
  count                        = var.container_app_required ? 1 : 0
  name                         = lower("${var.container_app_name}-${var.environment}")
  container_app_environment_id = data.terraform_remote_state.capability_env_shared_workspace.outputs.container_app_environment_internal_id
  resource_group_name          = module.resourcegroup.name
  revision_mode                = "Single"


  ingress {
    target_port      = 3333
    external_enabled = true
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
    # ipSecurityRestrictions = [
    #   {
    #     name : "Front Door",
    #     ipAddressRange : "147.243.0.0/16",
    #     action : "Allow"
    #   }
    # ],
  }

  registry {
    password_secret_name = lower(data.azurerm_key_vault_secret.hub_acr_password[0].name)
    server               = var.acr_server
    username             = data.azurerm_key_vault_secret.hub_acr_username[0].value
  }

  secret {
    name  = lower(data.azurerm_key_vault_secret.hub_acr_password[0].name)
    value = data.azurerm_key_vault_secret.hub_acr_password[0].value
  }

  template {

    container {
      image  = "axglbhubacr.azurecr.io/shell-bff:latest-dv" // Use placeholder image for initial deployment
      name   = lower("${var.container_app_name}-${var.environment}")
      cpu    = 0.25
      memory = "0.5Gi"
    }

    min_replicas = 1
    max_replicas = 3
  }
}
