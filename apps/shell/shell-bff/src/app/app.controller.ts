import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  /**
   * Api health check endpoint
   * @return {*}
   * @memberof AppController
   */
  @ApiResponse({ status: 200, description: 'Server is up.' })
  @Get('health')
  health() {
    return this.appService.health();
  }
}
