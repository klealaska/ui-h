import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App Module')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Configuration Endpoint Return current env for debugging
   * @return {*}
   * @memberof AppController
   */
  @ApiResponse({ status: 200, description: 'Current BFF configuration data.' })
  @Get('config')
  config() {
    return this.appService.getConfig();
  }

  /**
   * Api health check endpoint
   * @return {*}
   * @memberof AppController
   */
  @ApiResponse({ status: 200, description: 'Server is up.' })
  @Get('health')
  health() {
    return 'Ok';
  }
}
