import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.body) {
      delete req.headers['content-length'];
    }
    // this is a temporary fix to allow the request to go through to the dev server
    // currently the cert doesn't allow requests from localhost
    // TODO: remove this `if` once the cert is updated to allow loaclhost
    delete req.headers.host;
    next();
  }
}
