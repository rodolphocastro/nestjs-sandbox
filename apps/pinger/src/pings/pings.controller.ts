import { Controller, Get, Logger } from '@nestjs/common';
import { PingsService } from './pings.service';

@Controller('pings')
export class PingsController {
  private readonly logger = new Logger(PingsController.name);

  constructor(private readonly pingService: PingsService) {}

  @Get()
  allPings() {
    this.logger.debug('fetching all pings');
    return [
      {
        title: 'wow',
      },
    ];
  }
}
