environment   = "Pr"
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
workspace_name            = "uicoe-shell-prod"
shared_env_workspace_name = "uicoe-shared-resources-pr"


container_app_required = true

container_app_name = "shell-bff"

container_image_name = "axglbhubacr.azurecr.io/shell-bff:latest"

location     = "eastus"
alerts_email = "930310be.avidxchange.com@amer.teams.ms"
