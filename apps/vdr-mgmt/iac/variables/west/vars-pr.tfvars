environment   = "Pr"
is_production = true

application_name = "vdrmgmtspa"
capability = {
  name   = "vdr-mgmt"
  abbrev = "vdrmgmt"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-vdr-mgmt-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-prwest"

container_app_required = true

container_app_name = "vdr-mgmt-bff"

container_image_name = "axglbhubacr.azurecr.io/vdr-mgmt-bff:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
