import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { WebSocket } from 'ws';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  connection
): Promise<void> {
  const ws = new WebSocket(connection.url);
  console.log('Send message');
  ws.on('open', function open() {
    console.log(req.rawBody);
    ws.send(req.rawBody);
  });

  ws.on('close', function close() {
    console.log('closed ws');
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: req,
  };
};

export default httpTrigger;
