environment   = "St"
is_production = true

application_name = "zombiedicespa"
capability = {
  name   = "demozombiedice"
  abbrev = "demo"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name            = "uicoe-demozombiedice-prod"
shared_env_workspace_name = "uicoe-shared-resources-st"

container_app_required = true

container_app_name = "demo-zombie-dice-api"

container_image_name = "axglbhubacr.azurecr.io/shell-bff:latest"

location     = "eastus"
alerts_email = "fb9e0d8c.avidxchange.com@amer.teams.ms"
