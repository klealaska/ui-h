
variable "capability" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "shared-resources"
    abbrev = "shared"
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
  type    = bool
  default = false
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

variable "app_service_plan" {
  default = "EastUSPlan"
  type    = string
}

variable "standard_sku" {
  type    = bool
  default = true
}

variable "sku_name" {
  type = object({
    tier     = string
    size     = string
    capacity = number
  })

  default = {
    tier     = "Standard",
    size     = "S1",
    capacity = 2
  }
}

variable "is_local_development" {
  default = true
  type    = bool
}

variable "aca_location" {
  default = "eastus"
  type    = string
}
