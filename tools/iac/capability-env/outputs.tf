output "app_insights_intrumentation_key" {
  description = "Instrumentation Key of Capability-Env App Insights."
  value       = module.appinsights.instrumentation_key
  sensitive   = true
}

output "app_insights_connection_string" {
  description = "Connection String of Capability-Env App Insights."
  value       = module.appinsights.connection_string
  sensitive   = true
}

output "global_reader_identity_client_id" {
  description = "Client Id of Capability-Env User Assigned Identity with Reader role assignments."
  value       = azurerm_user_assigned_identity.global_reader.client_id
}

output "global_reader_identity_id" {
  description = "Id of Capability-Env User Assigned Identity with Reader role assignments."
  value       = azurerm_user_assigned_identity.global_reader.id
}

output "global_writer_identity_client_id" {
  description = "Client Id of Capability-Env User Assigned Identity with Writer role assignments."
  value       = azurerm_user_assigned_identity.global_writer.client_id
}

output "global_writer_identity_id" {
  description = "Id of Capability-Env User Assigned Identity with Writer role assignments."
  value       = azurerm_user_assigned_identity.global_writer.id
}

output "keyvault_uri" {
  description = "Uri of Capability-Env Key Vault."
  value       = module.keyvault.uri
}

output "resource_group_name" {
  description = "Name of Resource Group"
  value       = module.resourcegroup.name
}

output "resource_group_id" {
  description = "ID of Resource Group"
  value       = module.resourcegroup.id
}

output "resource_group_location" {
  description = "Azure Location of Resource Group "
  value       = module.resourcegroup.location
}

output "log_analytics_workspace_id" {
  description = "Log Analytics Workspace ID"
  value       = module.loganalytics.id
}

output "storage_account_name" {
  description = "Storage Account Name"
  value       = azurerm_storage_account.storage_account.name
}


output "storage_account_access_key" {
  description = "Storage Account Access Key"
  value       = azurerm_storage_account.storage_account.primary_access_key
  sensitive   = true
}

output "storage_account_static_web_url" {
  description = "Storage Account Static Website URL"
  value       = azurerm_storage_account.storage_account.primary_web_endpoint
}


# output "container_app_name" {
#   description = "Container App Name"
#   sensitive   = false
#   value       = length(azapi_resource.container_app) > 0 ? azapi_resource.container_app[0].name : null
# }

# output "container_app_service_url" {
#   description = "Container App Service Url"
#   sensitive   = false
#   value       = length(azapi_resource.container_app) > 0 ? jsondecode(azapi_resource.container_app[0].output).properties.configuration.ingress.fqdn : null
# }

output "container_app_internal_name" {
  description = "Container App Internal Name"
  value       = length(azurerm_container_app.container_app_internal) > 0 ? azurerm_container_app.container_app_internal[0].name : null
}

output "container_app_internal_service_url" {
  description = "Container App Internal Service Url"
  value       = length(azurerm_container_app.container_app_internal) > 0 ? azurerm_container_app.container_app_internal[0].ingress[0].fqdn : null
}

