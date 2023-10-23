import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      // we need to delete the content-length header we get from the frontend
      // since we are changing the content-type
      if (req.body) {
        delete req.headers['content-length'];
      }
      // this is a temporary fix to allow the request to go through to the dev server
      // currently the cert doesn't allow requests from localhost
      // TODO: remove this `if` once the cert is updated to allow loaclhost
      delete req.headers.host;
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
