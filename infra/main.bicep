targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the AZD environment, used to name resources.')
param environmentName string

@minLength(1)
@description('Primary Azure region for all resources.')
param location string

@description('Optional container image to deploy. Defaults to a placeholder; AZD will overwrite this with the built image.')
param webappImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

var resourceSuffix = take(uniqueString(subscription().id, environmentName, location), 6)
var tags = {
  'azd-env-name': environmentName
}

resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module resources './resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    location: location
    tags: tags
    resourceSuffix: resourceSuffix
    webappImage: webappImage
  }
}

// AZD reads UPPERCASE outputs and exposes them as env vars
output AZURE_RESOURCE_GROUP string = rg.name
output AZURE_LOCATION string = location
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = resources.outputs.containerRegistryLoginServer
output AZURE_CONTAINER_REGISTRY_NAME string = resources.outputs.containerRegistryName
output AZURE_LOG_ANALYTICS_WORKSPACE_ID string = resources.outputs.logAnalyticsWorkspaceId
output WEBAPP_URL string = resources.outputs.webappUrl
output WEBAPP_NAME string = resources.outputs.webappName
