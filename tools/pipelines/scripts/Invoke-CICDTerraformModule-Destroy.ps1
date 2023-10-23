[CmdletBinding(DefaultParameterSetName = 'Domain')]
param (
    [Parameter(Mandatory)]
    [String]$Domain,

    [Parameter(Mandatory)]
    [String]$Capability,

    [Parameter(Mandatory)]
    [String]$Environment,

    [Parameter(Mandatory)]
    [String]$SubscriptionId,

    [Parameter(Mandatory)]
    [String]$VarFile,

    [Parameter(Mandatory)]
    [String]$WorkingDirectory
)

Get-PSRepository
Install-AvidModule 'AvidXchange.CICD.Terraform' -MinimumVersion '1.1.0'
# Install-AvidModule 'AvidXchange.CICD.Terraform' -RequiredVersion '1.0.121628'
Import-Module 'AvidXchange.CICD.Terraform'

$InitParams = @{
    SubscriptionId   = $SubscriptionId
    WorkingDirectory = $WorkingDirectory
    Domain           = $Domain
    Capability       = $Capability
    Environment      = $Environment
}

# Check if the isRefresh environment variable exists and use its value, otherwise default to 'True'
$refreshValue = if ($null -ne $env:ISREFRESH) { $env:ISREFRESH } else { 'True' }

$WorkspaceName = ("$Domain-$Capability-$Environment").ToLower()

Write-Output "Refresh value is set to: $refreshValue"
Write-Output "Destroy value is set to: ${env:RUNDESTROY}"
Write-Output "Subscription ID: $SubscriptionId"
Write-Output "Capability : $Capability"
Write-Output "Environment: $Environment"
Write-Output "Workspace Name: $WorkspaceName"

Write-Verbose "Executing Invoke-TerraformInit"
Invoke-TerraformInit @InitParams

# Check the RUNREMOVE environment variable and conditionally run Remove-TerraformWorkspace
if ($env:RUNREMOVE -eq 'True') {
    $Option1 = "-refresh=$refreshValue"
    $Option2 = "-lock=false"
    $OptionList = @($Option1, $Option2)

    Write-Verbose "Executing Remove-TerraformWorkspace"
    Remove-TerraformWorkspace -VarFile $VarFile -WorkingDirectory $WorkingDirectory -WorkspaceName $WorkspaceName -OptionList $OptionList -Force
} elseif (${env:RUNDESTROY} -eq 'True') {
    Write-Verbose "Executing Invoke-TerraformDestroy"
    Invoke-TerraformDestroy -VarFile $VarFile -WorkingDirectory $WorkingDirectory -OptionList @("-refresh=$refreshValue") -Force
}
