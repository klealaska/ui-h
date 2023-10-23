environment   = "Ci"
is_production = false

application_name = "teammaturityspa"
capability = {
  name   = "team-maturity"
  abbrev = "teammat"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-team-maturity-nonprod"
shared_env_workspace_name = "uicoe-shared-resources-ci"

container_app_required = false

container_app_name = "team-maturity-bff"

container_image_name = "axglbhubacr.azurecr.io/team-maturity-bff:latest"

location = "eastus"

alerts_email = "mweaver@avidxchange.com"
