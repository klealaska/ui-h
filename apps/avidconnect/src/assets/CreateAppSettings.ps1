$environment = $Args[0]
$pathParam = $Args[1]

Write-Host "Environment:: "$environment
Write-Host "Path as param:: "$pathParam
$fullLocation = $MyInvocation.MyCommand.Path
Write-Host "Full location:: " $fullLocation


$appSettingsTemplate = Get-Content $pathParam"app.config.template.json" | Out-String | ConvertFrom-Json
$appSettingsDefault = Get-Content $pathParam"app.config.json" | Out-String | ConvertFrom-Json 

#load template
$outputAppSettings = New-Object 'System.Collections.Hashtable'
foreach ($property in $appSettingsTemplate.PSObject.Properties) {
    $outputAppSettings.Add($property.Name, "")
}

# copy data from environment variable file 
$environmentFile = $pathParam + '/variables/' + $environment + '.json'
$environmentSettings = Get-Content $environmentFile | Out-String | ConvertFrom-Json 
foreach ($property in $environmentSettings.PSObject.Properties) {

    if ($outputAppSettings.ContainsKey($property.Name)){
        $outputAppSettings[$property.Name] = $property.Value
    }  
}

#if field is empty then copy data from appSettings.json
foreach ($property in $appSettingsDefault.PSObject.Properties) {
    
    if ($outputAppSettings.ContainsKey($property.Name)){
        if ($outputAppSettings[$property.Name] -eq ""){
            $outputAppSettings[$property.Name] = $property.Value
        }
    }     
}

foreach ($item in $outputAppSettings.Keys) {
    Write-Host "Template Filed " + $item " - Value: " $outputAppSettings[$item]
}
#Save the appSettings.json with all values
$outputAppSettings | ConvertTo-Json -Depth 10 | Out-File $pathParam"app.config.json"