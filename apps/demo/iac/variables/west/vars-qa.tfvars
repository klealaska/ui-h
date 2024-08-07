environment   = "Qa"
is_production = false

application_name = "zombiedicespa"
capability = {
  name   = "demozombiedice"
  abbrev = "demo"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name            = "uicoe-demozombiedice-nonprodwest"
shared_env_workspace_name = "uicoe-shared-resources-qawest"

container_app_required = true

container_app_name = "demo-zombie-dice-api"

container_image_name = "axglbhubacr.azurecr.io/shell-bff:latest"

location     = "westus"
alerts_email = "fb9e0d8c.avidxchange.com@amer.teams.ms"
