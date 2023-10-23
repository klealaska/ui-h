
variable "capability" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "shared-frontdoor"
    abbrev = "fd"
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

variable "defaultEndpointId" {
  type    = string
  default = "/subscriptions/8f9290f9-f4dc-4be5-83e2-3c831b8d66ee/resourcegroups/Ax-Ae1-UicoeNp-Dv-Shared-Frontdoor-Rg/providers/Microsoft.Cdn/profiles/frontdoor-dv/afdendpoints/shell-spa-dv"
}
