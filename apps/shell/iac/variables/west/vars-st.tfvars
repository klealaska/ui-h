environment   = "St"
is_production = true

application_name = "shellspa"
capability = {
  name   = "shell"
  abbrev = "shell"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name            = "uicoe-shell-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-stwest"

container_app_required = true

container_app_name = "shell-bff"

container_image_name = "uicoeshell.azurecr.io/shell-bff:latest"

location     = "westus"
alerts_email = "930310be.avidxchange.com@amer.teams.ms"
