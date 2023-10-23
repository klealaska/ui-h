terraform {
  backend "remote" {}
}

# Configure the Microsoft Azure Provider

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

provider "azapi" {
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

resource "azurerm_virtual_network" "vnet" {
  name                = lower("aca-${var.environment}-vnet")
  location            = var.aca_location
  resource_group_name = module.resourcegroup.name
  address_space       = ["10.204.0.0/16"]
}

resource "azurerm_subnet" "plssubnet" {
  name                                          = "pls-subnet"
  resource_group_name                           = module.resourcegroup.name
  virtual_network_name                          = azurerm_virtual_network.vnet.name
  address_prefixes                              = ["10.204.1.0/24"]
  private_link_service_network_policies_enabled = false
}

resource "azurerm_subnet" "acasubnet" {
  name                 = "aca-subnet"
  resource_group_name  = module.resourcegroup.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.204.2.0/23"]
}


resource "azurerm_container_app_environment" "container_app_environment_internal" {
  name                           = lower("${var.environment}-internal")
  location                       = var.aca_location
  resource_group_name            = module.resourcegroup.name
  log_analytics_workspace_id     = module.loganalytics.id
  infrastructure_subnet_id       = azurerm_subnet.acasubnet.id
  internal_load_balancer_enabled = true
}

resource "azapi_resource" "container_app_environment" {
  name      = lower("${var.environment}")
  location  = module.resourcegroup.location
  parent_id = module.resourcegroup.id
  type      = "Microsoft.App/managedEnvironments@2022-10-01"
  body = jsonencode({
    properties = {
      appLogsConfiguration = {
        destination = "log-analytics"
        logAnalyticsConfiguration = {
          customerId = module.loganalytics.workspace_id
          sharedKey  = module.loganalytics.primary_shared_key
        }
      }
    }
  })
  ignore_missing_property = true
}

// section for private link service
data "azurerm_lb" "kubernetes-internal" {
  name                = "kubernetes-internal"
  resource_group_name = format("MC_%s-rg_%s_%s", split(".", azurerm_container_app_environment.container_app_environment_internal.default_domain)[0], split(".", azurerm_container_app_environment.container_app_environment_internal.default_domain)[0], var.aca_location)
}

resource "azurerm_private_link_service" "pls" {
  name                = lower("pls-aca-${var.environment}-${var.aca_location}")
  resource_group_name = module.resourcegroup.name
  location            = var.aca_location

  # visibility_subscription_ids                 = [data.azurerm_client_config.current.subscription_id]
  load_balancer_frontend_ip_configuration_ids = [data.azurerm_lb.kubernetes-internal.frontend_ip_configuration.0.id]
  # auto_approval_subscription_ids              = [data.azurerm_client_config.current.subscription_id]

  nat_ip_configuration {
    name                       = "primary"
    private_ip_address_version = "IPv4"
    subnet_id                  = azurerm_subnet.plssubnet.id
    primary                    = true
  }
}

module "basic_appconfig" {
  source  = "app.terraform.io/avidxchange/azure-appconfig/avid"
  version = "~>1.0.0"

  domain              = var.domain
  capability          = var.capability
  scope               = var.scope
  environment         = var.environment
  is_production       = var.is_production
  location            = module.resourcegroup.location
  resource_group_name = module.resourcegroup.name

  key_vault_id               = module.keyvault.id
  log_analytics_workspace_id = module.loganalytics.id

  # Optional Inputs Here
  use_standard_sku = var.standard_sku
}
