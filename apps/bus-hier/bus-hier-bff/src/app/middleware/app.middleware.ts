import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // we need to delete the content-length header we get from the frontend
    // since we are changing the content-type
    if (req.body) {
      delete req.headers['content-length'];
    }
    // this is a temporary fix to allow the request to go through to the dev server
    // currently the cert doesn't allow requests from localhost
    // TODO: remove this `if` once the cert is updated to allow loaclhost
    delete req.headers.host;
    req.headers.accept = 'application/x.avidxchange.accounting+json;version=1.0.0';
    req.headers['content-type'] = 'application/x.avidxchange.accounting+json;version=1.0.0';
    next();
  }
}
