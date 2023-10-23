terraform {
  backend "remote" {}
}

provider "azurerm" {
  features {}
}

# Capability Resource Naming Prefix
module "azure_resourcename" {
  source  = "app.terraform.io/avidxchange/azure-resourcename/avid"
  version = "~> 1.0.0"

  scope         = var.scope
  domain        = var.domain
  capability    = var.capability
  is_production = var.is_production
}

# Resource Group
module "resourcegroup" {
  source  = "app.terraform.io/avidxchange/azure-resourcegroup/avid"
  version = "~> 2.0.0"

  scope         = var.scope
  domain        = var.domain
  capability    = var.capability
  is_production = var.is_production
  location      = var.location
}

# Create Log Analytics Workspace using private Avid Module
module "loganalytics" {
  source = "app.terraform.io/avidxchange/azure-loganalytics/avid"

  domain              = var.domain
  capability          = var.capability
  scope               = var.scope
  is_production       = var.is_production
  location            = module.resourcegroup.location
  resource_group_name = module.resourcegroup.name
}

# Create Key Vault in Resource Group, sending Logs/Metrics to Log Analytics Workspace
module "keyvault" {
  source = "app.terraform.io/avidxchange/azure-keyvault/avid"

  domain                     = var.domain
  capability                 = var.capability
  scope                      = var.scope
  is_production              = var.is_production
  location                   = module.resourcegroup.location
  resource_group_name        = module.resourcegroup.name
  log_analytics_workspace_id = module.loganalytics.id
}

data "azurerm_client_config" "current" {}

#set access policy for keyvault
resource "azurerm_key_vault_access_policy" "azure_kv_policy" {
  key_vault_id = module.keyvault.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Set",
    "List",
    "Get",
    "Delete",
    "Recover",
    "Purge",
  ]
}
