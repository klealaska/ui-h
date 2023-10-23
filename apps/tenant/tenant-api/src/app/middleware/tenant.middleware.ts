import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // we need to update the values for the `accept` and `content-type` headers
    // here to prevent corruption of the POST request body.
    // it needs to be sent from the front end with an `accept` header of */*
    // and a `content-type` header of application/json
    // however the backend needs the below values for those headers
    req.headers.accept = 'application/x.avidxchange.tenant+json;version=1.0.0';
    req.headers['content-type'] = 'application/x.avidxchange.tenant+json;version=1.0.0';
    next();
  }
}
