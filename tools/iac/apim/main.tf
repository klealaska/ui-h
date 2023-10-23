terraform {
  backend "remote" {}
}

# Configure the Microsoft Azure Provider

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

data "terraform_remote_state" "capability_env_shared_workspace_east" {
  backend = "remote"
  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.workspace_env_name_east
    }
  }
}

data "terraform_remote_state" "capability_env_shared_workspace_west" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.workspace_env_name_west
    }
  }
}

resource "azurerm_traffic_manager_profile" "bff_app_tm" {
    name                            = lower("${var.capability.name}-${var.environment}-traffic-manager")
    resource_group_name             = var.azure_rg_name
    traffic_routing_method          = var.traffic_routing_method
    traffic_view_enabled            = true
    dns_config {
      relative_name                 = "ax-ui-coe-${var.capability.name}-${var.environment}-dns-config"
      ttl                           = 100
    }
    monitor_config {
      protocol                      = "HTTPS"
      port                          = 443
      path                          = "/"
      interval_in_seconds           = 30
      timeout_in_seconds            = 5
      tolerated_number_of_failures  = 0
    }
    tags = {
      domain = var.domain.name
    }
    lifecycle {
      ignore_changes = [tags]
    }
}

resource "azurerm_traffic_manager_external_endpoint" "web_app_west_ep" {
  name       = lower("${var.container_app_name}-${var.environment}-west")
  profile_id = azurerm_traffic_manager_profile.bff_app_tm.id
  weight     = 100
  target     = "https://${data.terraform_remote_state.capability_env_shared_workspace_west.outputs.container_app_service_url}"
}

resource "azurerm_traffic_manager_external_endpoint" "web_app_east_ep" {
  name       = lower("${var.container_app_name}-${var.environment}-east")
  profile_id = azurerm_traffic_manager_profile.bff_app_tm.id
  weight     = 100
  target     = "https://${data.terraform_remote_state.capability_env_shared_workspace_east.outputs.container_app_service_url}"
}

module "api_management_api" {
  source                = "app.terraform.io/avidxchange/azure-apim-api/avid"
  version               = "~> 1.0.0"
  domain                = var.domain
  capability            = var.capability_apim
  environment           = var.environment
  api_name              = lower("${var.container_app_name}-${var.environment}")
  openapi_spec_filepath = var.openapi_spec_filepath
  service_url           = azurerm_traffic_manager_profile.bff_app_tm.fqdn
  policy                = var.policy
}