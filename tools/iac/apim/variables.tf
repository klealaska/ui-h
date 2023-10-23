variable "capability_apim" {
  type = object({
    name   = string
    abbrev = string
  })

  default = {
    name   = "apim"
    abbrev = "apim"
  }
}

variable "capability" {
  type = object({
    name   = string
    abbrev = string
  })
}

variable "traffic_routing_method" {
  type = string
  description = "(Required) Specifies the algorithm used to route traffic. Possible values : Geographic, Weighted, Performance, Priority, Subnet and MultiValue"
  default = "Performance"
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

variable "openapi_spec_filepath" {
  default = ""
  type    = string
}

variable "policy" {
  default = "empty"
  type    = string
}

variable "container_app_name" {
  default = ""
  type    = string
}

variable "workspace_env_name_west"  {
  type     = string
  default  = ""
}

variable "workspace_env_name_east"  {
  type     = string
  default  = ""
  }

  variable "azure_rg_name" {
    type     = string
    default  = ""
  }