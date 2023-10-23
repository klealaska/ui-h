import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, data): Promise<any> {
  context.bindings.actions = {
    actionName: 'sendToAll',
    data: JSON.stringify(data),
    dataType: 'text',
  };
  // UserEventResponse directly return to caller
  var response = {
    data: '[SYSTEM] ack.',
    dataType: 'text',
  };
  return response;
};

export default httpTrigger;
