terraform {
  required_version = ">= 0.14.6"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "= 3.64"
    }
    azapi = {
      source = "Azure/azapi"
    }
  }
}