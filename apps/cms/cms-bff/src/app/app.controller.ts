import { Controller, Get, Param, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/products')
  async getProducts(@Query('locale') locale) {
    return await this.appService.getProducts(locale);
  }

  @Get('/product')
  async getProductById(@Query('productId') productId, @Query('locale') locale) {
    return await this.appService.getProductsById(productId, locale);
  }

  @Get('/:CONTENT')
  async getDetails(@Param('CONTENT') content: string, @Query('locale') locale) {
    return await this.appService.getDetails(content, locale);
  }
}
