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
workspace_name            = "uicoe-tenant-prod"
shared_env_workspace_name = "uicoe-shared-resources-pr"

container_app_required = true

container_app_name = "tenant-api"

container_image_name = "axglbhubacr.azurecr.io/tenant-api:latest"

location = "eastus"

alerts_email = "4e805e1a.avidxchange.com@amer.teams.ms"
