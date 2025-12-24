import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PingsService {
  private readonly logger = new Logger(PingsService.name);
}
