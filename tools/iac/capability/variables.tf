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

variable "keyVault_Domain" {
  type = object({
    name   = string
    abbrev = string
  })
  default = {
    name   = "User-Interface-Center-of-Excellence"
    abbrev = "uicoe"
  }
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
  default = "capability"
}
