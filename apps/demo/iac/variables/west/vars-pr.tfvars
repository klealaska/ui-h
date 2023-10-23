environment   = "Pr"
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

workspace_name            = "uicoe-demozombiedice-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-prwest"

container_app_required = true

container_app_name = "demo-zombie-dice-api"

container_image_name = "axglbhubacr.azurecr.io/shell-bff:latest"

location     = "westus"
alerts_email = "fb9e0d8c.avidxchange.com@amer.teams.ms"
