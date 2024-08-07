environment   = "Ci"
is_production = false

application_name = "usrmgmtspa"
capability = {
  name   = "usr-mgmt"
  abbrev = "usrmgmt"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-usr-mgmt-nonprod"
shared_env_workspace_name = "uicoe-shared-resources-ci"

container_app_required = true

container_app_name = "usr-mgmt-bff"

container_image_name = "axglbhubacr.azurecr.io/usr-mgmt-bff:latest"

location = "eastus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
