environment   = "Qa"
is_production = false

application_name = "paytranspa"
capability = {
  name   = "pay-transformation"
  abbrev = "paytran"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}
workspace_name            = "uicoe-pay-transformation-nonprod"
shared_env_workspace_name = "uicoe-shared-resources-qa"

container_app_required = true

container_app_name = "pay-transformation-bff"

container_image_name = "axglbhubacr.azurecr.io/pay-transformation-bff:latest"

location     = "eastus"
alerts_email = "570aa9e8.avidxchange.com@amer.teams.ms"
