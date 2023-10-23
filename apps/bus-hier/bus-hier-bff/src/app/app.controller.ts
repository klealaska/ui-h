import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App Module')
@Controller()
export class AppController {
  constructor(private service: AppService) {}

  /**
   * Api health check endpoint
   * @return {*}
   * @memberof AppController
   */
  @ApiResponse({ status: 200, description: 'Server is up.' })
  @Get('health')
  health() {
    return this.service.health();
  }
}
