import { IPing } from './pings.entity';
import { Injectable, Logger, Provider } from '@nestjs/common';
import Valkey from 'iovalkey';

export const PING_REPOSITORY_TOKEN = Symbol('IPingsRepository');

export interface IPingsRepository {
  listAll(): Promise<ReadonlyArray<IPing>>;
  insert(ping: IPing): Promise<void>;
}

@Injectable()
export class ValkeyPingsRepository implements IPingsRepository {
  private readonly logger = new Logger(ValkeyPingsRepository.name);
  private readonly PINGS_COLLECTION = 'pings';

  constructor(private readonly valkey: Valkey) {}

  async listAll(): Promise<ReadonlyArray<IPing>> {
    this.logger.debug('listing all pings');
    try {
      const got = await this.valkey.call('JSON.GET', this.PINGS_COLLECTION);
      if (typeof got === 'string') {
        return JSON.parse(got) as IPing[];
      }
      return [];
    } catch (e) {
      this.logger.error('failed to list pings', e);
      throw e;
    }
  }

  async insert(ping: IPing) {
    this.logger.debug('inserting ping');
    /**
     * appends to the array if it exists, otherwise creates it.
     */
    const appendOrCreate = async () => {
      try {
        await this.valkey.call(
          'JSON.ARRAPPEND',
          this.PINGS_COLLECTION,
          '$',
          JSON.stringify(ping),
        );
      } catch {
        this.logger.log('failed to append, trying to insert');
        try {
          await this.valkey.call(
            'JSON.SET',
            this.PINGS_COLLECTION,
            '$',
            JSON.stringify([ping]),
          );
          return;
        } catch (e) {
          this.logger.error('failed to create ping array on valkey', e);
          throw e;
        }
      }
    };

    try {
      await appendOrCreate();
    } catch (e) {
      this.logger.error('failed to insert ping', e);
      throw e;
    }
  }
}

export const valkeyPingsRepositoryProvider: Provider = {
  provide: PING_REPOSITORY_TOKEN,
  useClass: ValkeyPingsRepository,
};
