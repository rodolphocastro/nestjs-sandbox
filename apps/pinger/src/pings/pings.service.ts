import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IPingsRepository } from './pings.repository';
import { PING_REPOSITORY_TOKEN } from './pings.repository';
import type { IPing } from './pings.entity';
import { ClientProxy } from '@nestjs/microservices';
import { PINGER_CLIENT } from './pings.publisher';

/**
 * Error thrown when attempting to insert a duplicated ping.
 */
export class DuplicatedPingError extends Error {
  constructor({ Title }: IPing) {
    super(`ping with title '${Title}' already exists`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Service that handles ping operations.
 * @param repository - The repository for ping CRUD operations.
 */
@Injectable()
export class PingsService {
  private readonly logger = new Logger(PingsService.name);

  constructor(
    @Inject(PING_REPOSITORY_TOKEN)
    private readonly repository: IPingsRepository,
    @Inject(PINGER_CLIENT)
    private readonly rabbitMqClient: ClientProxy,
  ) {}

  /**
   * Fetches all pings from the repository.
   * @throws {Error} - If there is an error fetching all pings.
   */
  async getAllPings(): Promise<ReadonlyArray<IPing>> {
    try {
      return await this.repository.listAll();
    } catch (error) {
      this.logger.error('error fetching all pings', error);
      throw error;
    }
  }

  /**
   * Inserts a ping into the repository.
   * @param ping the ping that should be inserted.
   * @throws {DuplicatedPingError} - If the ping already exists.
   * @throws {Error} - If there is an error inserting the ping.
   */
  async insertPing(ping: IPing): Promise<void> {
    const allPings = await this.getAllPings();
    if (allPings.some((p) => p.Title === ping.Title)) {
      throw new DuplicatedPingError(ping);
    }
    await this.repository.insert(ping);
    this.logger.debug('emitting ping to rabbitmq');
    this.rabbitMqClient.emit('ping.created', ping);
  }
}
