variable "application_name" {
  type    = string
  default = "shellspa"
}

variable "capability" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "uicoeshell"
    abbrev = "shell"
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

variable "workspace_name" {
  type    = string
  default = "uicoe-shell-nonprod"
}

variable "shared_env_workspace_name" {
  type    = string
  default = "uicoe-shared-resources-dv"
}

variable "app_service_plan" {
  default = "EastUSPlan"
  type    = string
}

variable "container_app_name" {
  default = "shell-bff"
  type    = string
}

variable "container_image_name" {
  default = "axglbhubacr.azurecr.io/shell-bff:latest"
  type    = string
}

variable "acr_server" {
  default = "axglbhubacr.azurecr.io"
  type    = string
}

variable "container_app_required" {
  type    = bool
  default = false
}

variable "alerts_email" {
  type    = string
  description = "alerts group email receiver"
  default = ""
}

