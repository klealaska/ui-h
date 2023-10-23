
output "bff_endpoint_id" {
  description = "BFF Endpoint ID"
  sensitive   = false
  value       = length(azurerm_cdn_frontdoor_endpoint.fd-endpoint) > 0 ? azurerm_cdn_frontdoor_endpoint.fd-endpoint[0].id : null
}


output "spa_endpoint_id" {
  description = "SPA Endpoint ID"
  sensitive   = false
  value       = azurerm_cdn_frontdoor_endpoint.fd-endpoint-spa.id
}
