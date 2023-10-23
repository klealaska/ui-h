import { Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MOCK_ENV } from '../shared';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(@Inject(MOCK_ENV) private _mockEnv: boolean) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (!this._mockEnv) {
      if (req.headers.authorization) {
        req.headers.accept = 'application/json';
        req.headers['content-type'] = 'application/json-patch+json';
        delete req.headers.host;
        delete req.headers['postman-token'];
        delete req.headers['content-length'];
        next();
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
