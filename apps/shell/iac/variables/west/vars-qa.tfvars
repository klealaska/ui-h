environment   = "Qa"
is_production = false

application_name = "shellspa"
capability = {
  name   = "shell"
  abbrev = "shell"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name            = "uicoe-shell-nonprodwest"
shared_env_workspace_name = "uicoe-shared-resources-qawest"

container_app_required = true

container_app_name = "shell-bff"

container_image_name = "axglbhubacr.azurecr.io/shell-bff:latest"

location     = "westus"
alerts_email = "930310be.avidxchange.com@amer.teams.ms"
