import { Module } from '@nestjs/common';
import { MockHttpService } from './services/mock-http.service';

@Module({
  controllers: [],
  providers: [MockHttpService],
  exports: [MockHttpService],
  imports: [],
})
export class SharedBffDataAccessModule {}
