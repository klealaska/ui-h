environment   = "Pr"
is_production = true

application_name = "teammaturityspa"
capability = {
  name   = "team-maturity"
  abbrev = "teammat"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}

workspace_name = "uicoe-team-maturity-prod"
shared_env_workspace_name = "uicoe-shared-resources-pr"

container_app_required = false

container_app_name = "team-maturity-bff"

container_image_name = "axglbhubacr.azurecr.io/team-maturity-bff:latest"

location = "eastus"

alerts_email = "mweaver@avidxchange.com"
