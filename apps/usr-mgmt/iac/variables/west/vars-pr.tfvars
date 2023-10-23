environment   = "Pr"
is_production = true

application_name = "usrmgmtspa"
capability = {
  name   = "usr-mgmt"
  abbrev = "usrmgmt"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-usr-mgmt-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-prwest"

container_app_required = true

container_app_name = "usr-mgmt-bff"

container_image_name = "axglbhubacr.azurecr.io/usr-mgmt-bff:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
