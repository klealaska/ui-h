output "capability_keyvault_uri" {
  description = "URI of the capability Keyvault"
  value       = module.keyvault.uri
}

output "capability_keyvault_id" {
  description = "id of the capability Keyvault"
  value       = module.keyvault.id
}
