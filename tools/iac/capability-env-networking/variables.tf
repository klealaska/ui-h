variable "region1" {
  default = "eastus"
  type    = string
}

variable "region2" {
  default = "westus"
  type    = string
}

variable "env_workspace_name_region1" {
  type = string
}

variable "env_workspace_name_region2" {
  type = string
}

variable "shared_env_workspace_name_region1" {
  type = string
}

variable "shared_env_workspace_name_region2" {
  type = string
}

variable "shared_frontdoor_workspace_name" {
  type = string
}

variable "spa_name" {
  type = string
}

variable "container_app_required" {
  type    = bool
  default = true
}
