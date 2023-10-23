
param (
    [Parameter(Mandatory)]
    [string] $applicationId,

    [Parameter(Mandatory)]
    [string] $sonatypeOrgName,

    [Parameter(Mandatory)]
    [string] $sonatypePassword,

    [string] $sonatypeUsername = "sca_user"
)

#Setting sonatype credentails from DevOps.Common library group
$sonatypeCred = $sonatypeUsername + ':' + $sonatypePassword
$sonatypeDefaultOrgName = "Avidxchange"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($sonatypeCred)
$cred = [System.Convert]::ToBase64String($bytes)
$sonatypeEndpoint = "http://SonatypeIQServer.avidxchange.com:8070"

#Get Sonatype default organization Id
$defaultOrgUri = "$sonatypeEndpoint/api/v2/organizations?organizationName=$sonatypeDefaultOrgName"
$getDefaultOrg = Invoke-RestMethod -Uri $defaultOrgUri -Method GET -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
$defaultOrgId = $getDefaultOrg.organizations.id
$defaultOrgName = $getDefaultOrg.organizations.name

#Write output
write-host "Sonatype Default Organization ID: " $defaultOrgId
write-host "Sonatype Default Organization Name: " $defaultOrgName

#Get Specified organization Id
$specifiedOrgUri = "$sonatypeEndpoint/api/v2/organizations?organizationName=$sonatypeOrgName"
$getSpecificOrg = Invoke-RestMethod -Uri $specifiedOrgUri -Method GET -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
$specifiedOrgId = $getSpecificOrg.organizations.id
$specifiedOrgName = $getSpecificOrg.organizations.name

#Write output
write-host "Sonatype Specified Organization ID: " $specifiedOrgId
write-host "Sonatype Specified Organization Name: " $specifiedOrgName

#Get ORG id for scanned application
$sonatypeAppIdUri = "$sonatypeEndpoint/api/v2/applications?publicId=$applicationId"
$getSonatypeAppId = Invoke-RestMethod -Uri $sonatypeAppIdUri -Method GET -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
$sonatypeAppOrgId = $getSonatypeAppId.applications.organizationId
$sonatypeAppId = $getSonatypeAppId.applications.id

#Write output
write-host "Organization ID for scanned application: " $sonatypeAppOrgId
write-host "Application ID for scanned application: " $sonatypeAppId

#If the scanned application organization ID is equel to the default organization then the scanned project will need to be moved to domain aligned sonatype project."ebf9458e7a624c6a8d4a319899f8edf5"
if(($sonatypeAppOrgId -ne $defaultOrgId) -or ($sonatypeOrgName -eq $sonatypeDefaultOrgName)){
    Write-Host "$applicationId already exists in domain specific sonatype project"
    if($sonatypeAppOrgId -ne $specifiedOrgId) {

        #Get Domain aligned organization ID for Sonatype Scan
        $orgUri = "$sonatypeEndpoint/api/v2/organizations?organizationName=$sonatypeOrgName"
        $getSonatypeOrgs = Invoke-RestMethod -Uri $orgUri -Method GET -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
        $sonatypeOrgId = $getSonatypeOrgs.organizations.id

        #Write outputl
        write-host "Domain aligned Sonatype Organization ID: " $sonatypeOrgId

        #Move scan project to domain aligned organization
        $moveAppUrl = "$sonatypeEndpoint/api/v2/applications/$sonatypeAppId/move/organization/$sonatypeOrgId"
        $moveAppToDomainOrg = Invoke-RestMethod -Uri $moveAppUrl -Method POST -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
    }
} else {

    #Get Domain aligned organization ID for Sonatype Scan
    $orgUri = "$sonatypeEndpoint/api/v2/organizations?organizationName=$sonatypeOrgName"
    $getSonatypeOrgs = Invoke-RestMethod -Uri $orgUri -Method GET -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
    $sonatypeOrgId = $getSonatypeOrgs.organizations.id

    #Write outputl
    write-host "Domain aligned Sonatype Organization ID: " $sonatypeOrgId

    #Move scan project to domain aligned organization
    $moveAppUrl = "$sonatypeEndpoint/api/v2/applications/$sonatypeAppId/move/organization/$sonatypeOrgId"
    $moveAppToDomainOrg = Invoke-RestMethod -Uri $moveAppUrl -Method POST -Headers @{"Authorization"="Basic $cred"} -ContentType "application/json"
}
