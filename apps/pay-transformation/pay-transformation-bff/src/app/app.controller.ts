import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App Module')
@Controller()
export class AppController {
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
