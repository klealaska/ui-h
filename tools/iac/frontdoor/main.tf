terraform {
  backend "remote" {}
}

# Configure the Microsoft Azure Provider

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

# Data Blocks
data "azurerm_client_config" "current" {}

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

resource "azurerm_cdn_frontdoor_profile" "fd-profile" {
  name                = lower("frontdoor-${var.environment}")
  resource_group_name = module.resourcegroup.name
  sku_name            = "Premium_AzureFrontDoor"
}

resource "azurerm_cdn_frontdoor_firewall_policy" "fd_policy" {
  name                = lower("fdwaf${var.environment}")
  resource_group_name = module.resourcegroup.name
  sku_name            = azurerm_cdn_frontdoor_profile.fd-profile.sku_name
  enabled             = true
  mode                = "Prevention"
  managed_rule {
    type    = "DefaultRuleSet"
    version = "1.0"
    action  = "Block"

    exclusion {
      match_variable = "QueryStringArgNames"
      operator       = "Equals"
      selector       = "filters[productID][$eq]"
    }
  }

  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.0"
    action  = "Log"
  }
}

resource "azurerm_cdn_frontdoor_security_policy" "fd_security_policy" {
  name                     = "fd-${var.environment}-security-policy"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.fd-profile.id

  security_policies {
    firewall {
      cdn_frontdoor_firewall_policy_id = azurerm_cdn_frontdoor_firewall_policy.fd_policy.id

      association {
        domain {
          cdn_frontdoor_domain_id = var.defaultEndpointId
        }
        patterns_to_match = ["/*"]
      }
    }
  }
}
