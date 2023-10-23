workspace_env_name_east = "uicoe-tenant-pr"
workspace_env_name_west = "uicoe-tenant-prwest"
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
environment   = "Pr"
container_app_name = "tenant-bff"
traffic_routing_method = "Performance"
// CURRENTLY THERE IS NOT RG IN PROD
azure_rg_name = ""