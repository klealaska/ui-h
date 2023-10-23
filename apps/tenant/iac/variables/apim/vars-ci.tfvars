workspace_env_name_east = "uicoe-tenant-ci"
workspace_env_name_west = "uicoe-tenant-ciwest"
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
environment   = "Ci"
container_app_name = "tenant-bff"
traffic_routing_method = "Performance"
azure_rg_name = "AX-Ae1-Dv-Apim01-RG"