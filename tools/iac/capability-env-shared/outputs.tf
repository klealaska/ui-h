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

output "container_app_environment_id" {
  description = "Shared Container App Environment ID"
  value       = azapi_resource.container_app_environment.id
}

output "container_app_environment_internal_id" {
  description = "Shared Internal Container App Environment ID"
  value       = azurerm_container_app_environment.container_app_environment_internal.id
}
output "app_config_name" {
  description = "App Configuration Name"
  value       = module.basic_appconfig.name
}

output "pls_id" {
  description = "Private Link Service ID"
  value       = azurerm_private_link_service.pls.id
}

output "pls_location" {
  description = "Private Link Service Location"
  value       = azurerm_private_link_service.pls.location
}


