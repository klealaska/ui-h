import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  connection
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: connection,
  };
};

export default httpTrigger;
