
variable "capability" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "demozombiediceapi"
    abbrev = "demoapi"
  }
}

variable "domain" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "User-Interface-Center-of-Excellence"
    abbrev = "uicoe"
  }
}

variable "environment" {
  type = string
}

variable "is_production" {
  type = bool
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "scope" {
  type    = string
  default = "capability-env"
}

variable "capability_env_workspace_name" {
  type    = string
  default = "user-interface-center-of-excellence-demozombiedicespa-dv"
}

variable "capability_workspace_name" {
  type    = string
  default = "user-interface-center-of-excellence-demozombiedicespa-nonprod"
}

variable "app_service_plan" {
  default = "EastUSPlan"
  type    = string
}

variable "resource_group_name" {
  default = "Ax-Ae1-UicoeNp-Dv-Demozombiedicespa-Rg"
  type    = string
}

variable "pubsub_name" {
  default = "demo-zombie-dice"
  type    = string
}

variable "function_app_name" {
  default = "demo-zombie-dice-websockets"
  type    = string
}

variable "storage_account_name" {
  default = "demozombiediceui"
  type    = string
}

variable "container_app_name" {
  default = "demo-zombie-dice-api"
  type    = string
}

variable "container_image_name" {
  default = "demozombiedice.azurecr.io/demo-zombie-dice-api:latest"
  type    = string
}
