environment   = "St"
is_production = true

application_name = "usrrolesspa"
capability = {
  name   = "usr-roles"
  abbrev = "usrrole"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-usr-roles-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-stwest"

container_app_required = true

container_app_name = "usr-roles-bff"

container_image_name = "axglbhubacr.azurecr.io/usr-roles-bff:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
