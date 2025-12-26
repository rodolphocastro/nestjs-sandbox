import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DuplicatedPingError, PingsService } from './pings.service';
import type { IPing } from './pings.entity';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { EventPattern } from '@nestjs/microservices';

/**
 * DTO for a ping.
 * @property title - The title of the ping.
 * @property createdOn - The date the ping was created.
 * @property isAcknowledged - Whether the ping has been acknowledged.
 */
export class PingDto {
  @ApiProperty()
  public readonly isAcknowledged: boolean;

  @ApiProperty()
  public readonly createdOn: Date;

  @ApiProperty()
  public readonly title: string;

  constructor({ Title, CreatedOn, IsAcknowledged }: IPing) {
    this.title = Title;
    this.createdOn = CreatedOn;
    this.isAcknowledged = IsAcknowledged;
  }
}

/**
 * DTO for creating a ping.
 * @property title - The title of the ping.
 */
export class CreatePingDto {
  @ApiProperty()
  public readonly title: string;
}

/**
 * Response for creating a ping.
 * @property title - The title of the ping.
 * @property createdOn - The date the ping was created.
 */
export class CreatePingResponse {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly createdOn: Date;

  constructor({ Title, CreatedOn }: IPing) {
    this.title = Title;
    this.createdOn = CreatedOn;
  }
}

@Controller('pings')
@UseInterceptors(CacheInterceptor)
export class PingsController {
  private readonly logger = new Logger(PingsController.name);

  constructor(@Inject() private readonly pingService: PingsService) {}

  @Get()
  @ApiResponse({ status: 200, type: [PingDto] })
  async listAllPings() {
    this.logger.debug('fetching all pings');
    const pings = await this.pingService.getAllPings();
    return pings.map((ping) => new PingDto(ping));
  }

  @Post()
  @ApiResponse({ status: 201, type: CreatePingResponse })
  @ApiResponse({ status: 400, description: 'ping already exists' })
  async createPing(
    @Body() newPing: CreatePingDto,
  ): Promise<CreatePingResponse> {
    this.logger.debug('creating a ping');
    try {
      const ping: IPing = {
        Title: newPing.title,
        CreatedOn: new Date(),
        IsAcknowledged: false,
      };
      await this.pingService.insertPing(ping);
      return new CreatePingResponse(ping);
    } catch (err) {
      if (err instanceof DuplicatedPingError) {
        this.logger.debug('ping already exists');
        throw new BadRequestException('ping already exists');
      }
      this.logger.error('failed to create ping', err);
      throw err;
    }
  }
}
