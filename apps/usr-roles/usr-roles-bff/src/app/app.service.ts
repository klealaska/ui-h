/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): string {
    return 'Status: Ok';
  }
}
