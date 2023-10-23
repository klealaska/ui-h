environment   = "Qa"
is_production = false

application_name = "usrrolesspa"
capability = {
  name   = "usr-roles"
  abbrev = "usrrole"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-usr-roles-nonprodwest"
shared_env_workspace_name = "uicoe-shared-resources-qawest"

container_app_required = true

container_app_name = "usr-roles-bff"

container_image_name = "axglbhubacr.azurecr.io/usr-roles-bff:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
