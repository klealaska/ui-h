environment   = "Qa"
is_production = false

application_name = "bamspa"
capability = {
  name   = "bank-account-mgmt"
  abbrev = "bam"
}

domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}
workspace_name            = "uicoe-bank-account-mgmt-nonprod"
shared_env_workspace_name = "uicoe-shared-resources-qa"

container_app_required = true

container_app_name = "bank-account-mgmt-api"

container_image_name = "axglbhubacr.azurecr.io/bank-account-mgmt-api:latest"

location     = "eastus"
alerts_email = "570aa9e8.avidxchange.com@amer.teams.ms"
