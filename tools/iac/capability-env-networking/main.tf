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

data "terraform_remote_state" "shared_frontdoor" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.shared_frontdoor_workspace_name
    }
  }
}

data "terraform_remote_state" "env_shared_workspace_region1" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.shared_env_workspace_name_region1
    }
  }
}

data "terraform_remote_state" "env_shared_workspace_region2" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.shared_env_workspace_name_region2
    }
  }
}


data "terraform_remote_state" "capability_env_workspace_region1" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.env_workspace_name_region1
    }
  }
}
data "terraform_remote_state" "capability_env_workspace_region2" {
  backend = "remote"

  config = {
    hostname     = "app.terraform.io"
    organization = "avidxchange"
    workspaces = {
      name = var.env_workspace_name_region2
    }
  }
}


// Integrate BFF with Front Door
resource "azurerm_cdn_frontdoor_endpoint" "fd-endpoint" {
  count                    = var.container_app_required ? 1 : 0
  name                     = data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_name
  cdn_frontdoor_profile_id = data.terraform_remote_state.shared_frontdoor.outputs.frontdoor_profile_id
}

resource "azurerm_cdn_frontdoor_origin_group" "fd-origin-group" {
  count                    = var.container_app_required ? 1 : 0
  name                     = "${data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_name}-origingroup"
  cdn_frontdoor_profile_id = data.terraform_remote_state.shared_frontdoor.outputs.frontdoor_profile_id

  health_probe {
    interval_in_seconds = 100
    path                = "/api/health"
    protocol            = "Https"
    request_type        = "HEAD"
  }

  load_balancing {
    additional_latency_in_milliseconds = 0
    sample_size                        = 16
    successful_samples_required        = 3
  }
}

resource "azurerm_cdn_frontdoor_origin" "fd-origin-region1" {
  count                          = var.container_app_required ? 1 : 0
  name                           = "${data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_name}-origin${var.region1}"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.fd-origin-group[0].id
  enabled                        = true
  host_name                      = data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_service_url
  origin_host_header             = data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_service_url
  priority                       = 1
  weight                         = 1000
  certificate_name_check_enabled = true

  private_link {
    request_message        = "Request access for Private Link Origin CDN Frontdoor"
    location               = data.terraform_remote_state.env_shared_workspace_region1.outputs.pls_location
    private_link_target_id = data.terraform_remote_state.env_shared_workspace_region1.outputs.pls_id
  }
}

resource "azurerm_cdn_frontdoor_origin" "fd-origin-region2" {
  count                          = var.container_app_required ? 1 : 0
  name                           = "${data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_name}-origin${var.region2}"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.fd-origin-group[0].id
  enabled                        = true
  host_name                      = data.terraform_remote_state.capability_env_workspace_region2.outputs.container_app_internal_service_url
  origin_host_header             = data.terraform_remote_state.capability_env_workspace_region2.outputs.container_app_internal_service_url
  priority                       = 1
  weight                         = 1000
  certificate_name_check_enabled = true

  private_link {
    request_message        = "Request access for Private Link Origin CDN Frontdoor"
    location               = data.terraform_remote_state.env_shared_workspace_region2.outputs.pls_location
    private_link_target_id = data.terraform_remote_state.env_shared_workspace_region2.outputs.pls_id
  }
}

resource "azurerm_cdn_frontdoor_route" "fd-route" {
  count                         = var.container_app_required ? 1 : 0
  name                          = "${data.terraform_remote_state.capability_env_workspace_region1.outputs.container_app_internal_name}-route"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.fd-endpoint[0].id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.fd-origin-group[0].id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.fd-origin-region1[0].id, azurerm_cdn_frontdoor_origin.fd-origin-region2[0].id]

  supported_protocols    = ["Http", "Https"]
  patterns_to_match      = ["/*"]
  forwarding_protocol    = "HttpsOnly"
  link_to_default_domain = true
  https_redirect_enabled = true
}




// Integrate SPA with Front Door

resource "azurerm_cdn_frontdoor_endpoint" "fd-endpoint-spa" {
  name                     = var.spa_name
  cdn_frontdoor_profile_id = data.terraform_remote_state.shared_frontdoor.outputs.frontdoor_profile_id
}

resource "azurerm_cdn_frontdoor_origin_group" "fd-origin-group-spa" {
  name                     = "${var.spa_name}-origingroup"
  cdn_frontdoor_profile_id = data.terraform_remote_state.shared_frontdoor.outputs.frontdoor_profile_id

  health_probe {
    interval_in_seconds = 100
    path                = "/"
    protocol            = "Https"
    request_type        = "GET"
  }
  load_balancing {
    additional_latency_in_milliseconds = 0
    sample_size                        = 16
    successful_samples_required        = 3
  }
}

resource "azurerm_cdn_frontdoor_origin" "fd-origin-region1-spa" {
  name                           = "${var.spa_name}-origin${var.region1}"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.fd-origin-group-spa.id
  enabled                        = true
  host_name                      = trim(trimprefix(data.terraform_remote_state.capability_env_workspace_region1.outputs.storage_account_static_web_url, "https://"), "/")
  origin_host_header             = trim(trimprefix(data.terraform_remote_state.capability_env_workspace_region1.outputs.storage_account_static_web_url, "https://"), "/")
  priority                       = 1
  weight                         = 1000
  certificate_name_check_enabled = true
}

resource "azurerm_cdn_frontdoor_origin" "fd-origin-region2-spa" {
  name                           = "${var.spa_name}-origin${var.region2}"
  cdn_frontdoor_origin_group_id  = azurerm_cdn_frontdoor_origin_group.fd-origin-group-spa.id
  enabled                        = true
  host_name                      = trim(trimprefix(data.terraform_remote_state.capability_env_workspace_region2.outputs.storage_account_static_web_url, "https://"), "/")
  origin_host_header             = trim(trimprefix(data.terraform_remote_state.capability_env_workspace_region2.outputs.storage_account_static_web_url, "https://"), "/")
  priority                       = 1
  weight                         = 1000
  certificate_name_check_enabled = true
}

resource "azurerm_cdn_frontdoor_route" "fd-route-spa" {
  name                          = "${var.spa_name}-route"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.fd-endpoint-spa.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.fd-origin-group-spa.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.fd-origin-region1-spa.id, azurerm_cdn_frontdoor_origin.fd-origin-region2-spa.id]

  supported_protocols    = ["Http", "Https"]
  patterns_to_match      = ["/*"]
  forwarding_protocol    = "HttpsOnly"
  link_to_default_domain = true
  https_redirect_enabled = true
}
