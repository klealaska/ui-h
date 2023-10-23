environment   = "Pr"
is_production = true

application_name = "bushierspa"
capability = {
  name   = "bus-hier"
  abbrev = "bushier"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-bus-hier-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-prwest"

container_app_required = true

container_app_name = "bus-hier-bff"

container_image_name = "axglbhubacr.azurecr.io/bus-hier-bff:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"

