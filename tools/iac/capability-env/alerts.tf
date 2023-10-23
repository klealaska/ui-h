locals {
  tags_for_monitoring = {
    Capability = var.capability.name
    Domain     = var.domain.name
  }
}

# Action group: send email
resource "azurerm_monitor_action_group" "email_notification_ag" {
  name                = "${var.environment}_email_notification_ag_${var.capability.name}"
  short_name          = "ag_${var.capability.abbrev}"
  resource_group_name = module.resourcegroup.name

  email_receiver {
    name          = "SendEmailAlert"
    email_address = var.alerts_email
  }

  tags = local.tags_for_monitoring
}

#Container App alerts

# Traffic
resource "azurerm_monitor_metric_alert" "alert_traffic" {
  count               = var.container_app_required ? 1 : 0
  name                = "Container App - Traffic Alert - Requests"
  description         = "Container App - Greater than average total requests"
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_container_app.container_app_internal[0].id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.App/containerApps"
    metric_name       = "Requests"
    alert_sensitivity = "Low"
    operator          = "GreaterThan"
    aggregation       = "Total"
  }
  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

# Saturation - IO
resource "azurerm_monitor_metric_alert" "alert_network_bytes_in_time" {
  count               = var.container_app_required ? 1 : 0
  name                = "IO usage Alert - Network Bytes In"
  description         = "Greater than average network bytes in"
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_container_app.container_app_internal[0].id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.App/containerApps"
    metric_name       = "RxBytes"
    alert_sensitivity = "Low"
    operator          = "GreaterThan"
    aggregation       = "Average"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

resource "azurerm_monitor_metric_alert" "alert_network_bytes_out_time" {
  count               = var.container_app_required ? 1 : 0
  name                = "IO usage Alert - Network Bytes Out"
  description         = "Greater than average network bytes out"
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_container_app.container_app_internal[0].id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.App/containerApps"
    metric_name       = "TxBytes"
    alert_sensitivity = "Low"
    operator          = "GreaterThan"
    aggregation       = "Average"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

# Saturation - CPU
resource "azurerm_monitor_metric_alert" "alert_cpu_usage" {
  count               = var.container_app_required ? 1 : 0
  name                = "Saturation CPU Alert - CPU Usage"
  description         = "Greater than average CPU usage"
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_container_app.container_app_internal[0].id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.App/containerApps"
    metric_name       = "UsageNanoCores"
    alert_sensitivity = "Low"
    operator          = "GreaterThan"
    aggregation       = "Average"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

# Saturation - Memory
resource "azurerm_monitor_metric_alert" "alert_memory_usage" {
  count               = var.container_app_required ? 1 : 0
  name                = "Saturation Memory Alert - Memory Usage"
  description         = "Greater than average memory usage"
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_container_app.container_app_internal[0].id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.App/containerApps"
    metric_name       = "WorkingSetBytes"
    alert_sensitivity = "High"
    operator          = "GreaterThan"
    aggregation       = "Average"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

## Storage Account alerts ref: https://learn.microsoft.com/en-us/azure/storage/blobs/monitor-blob-storage?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal

resource "azurerm_monitor_metric_alert" "alert_storage_account_availability" {
  name                = "Storage Account - Availability"
  description         = "Storage Account - requests are successful 99% of the time."
  resource_group_name = module.resourcegroup.name
  scopes              = [azurerm_storage_account.storage_account.id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "0"

  criteria {
    metric_namespace = "Microsoft.Storage/storageAccounts"
    metric_name      = "Availability"
    aggregation      = "Minimum"
    operator         = "GreaterThanOrEqual"
    threshold        = 99
    dimension {
      name     = "ApiName"
      operator = "Include"
      values   = ["GetWebContent"]
    }

  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}


# App Insights Shared
# Errors

resource "azurerm_monitor_metric_alert" "alert_dep_failed-calls" {
  name                = "AppInsight - Dependency failed Called"
  description         = "AppInsight - Count of failed dependency calls made by the application to external resources. (BFF->Platform)"
  resource_group_name = module.resourcegroup.name
  scopes              = [data.azurerm_application_insights.application_insights.id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "0"

  dynamic_criteria {
    metric_namespace  = "Microsoft.Insights/components"
    metric_name       = "dependencies/failed"
    alert_sensitivity = "Medium"
    operator          = "GreaterThan"
    aggregation       = "Count"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}

# Latency
resource "azurerm_monitor_metric_alert" "alert_dep_duration" {
  name                = "AppInsight - Dependency duration"
  description         = "AppInsight - Duration of calls made by the application to external resources. (BFF->Platform)"
  resource_group_name = module.resourcegroup.name
  scopes              = [data.azurerm_application_insights.application_insights.id]
  frequency           = "PT1M"
  window_size         = "PT5M"
  severity            = "2"

  dynamic_criteria {
    metric_namespace  = "Microsoft.Insights/components"
    metric_name       = "dependencies/duration"
    alert_sensitivity = "Low"
    operator          = "GreaterThan"
    aggregation       = "Average"
  }

  action {
    action_group_id = azurerm_monitor_action_group.email_notification_ag.id
  }

  tags = local.tags_for_monitoring
}
