environment   = "Pr"
is_production = true

application_name = "tenantspa"
capability = {
  name   = "tenant"
  abbrev = "tenant"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name            = "uicoe-tenant-prodwest"
shared_env_workspace_name = "uicoe-shared-resources-prwest"

container_app_required = true

container_app_name = "tenant-api"

container_image_name = "axglbhubacr.azurecr.io/tenant-api:latest"

location = "westus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
