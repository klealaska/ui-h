workspace_env_name_east = "uicoe-tenant-qa"
workspace_env_name_west = "uicoe-tenant-qawest"
domain = {
  name   = "uicoe"
  abbrev = "uicoe"
}
capability_apim = {
  name   = "apim"
  abbrev = "apim"
}
capability = {
  name   = "tenant"
  abbrev = "tenant"
}
policy = "empty"
openapi_spec_filepath = "tenant-swagger.json"
environment   = "Qa"
container_app_name = "tenant-bff"
traffic_routing_method = "Performance"
azure_rg_name = "AX-Ae1-Dv-Apim01-RG"