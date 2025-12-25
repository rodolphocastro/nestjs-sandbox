import { DynamicModule, Logger, Provider, Scope } from '@nestjs/common';
import Valkey from 'iovalkey';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvValkey from '@keyv/valkey';

/**
 * Valkey provider for this application.
 */
export const valkeyProvider: Provider = {
  provide: Valkey,
  useFactory: (config: ConfigService) => {
    /**
     * attempts to create a single ValKey connection and hand it over the app.
     */
    const logger = new Logger('valkeyProvider');
    logger.log('creating valkey');
    const valkeyHost = config.get<string>('VALKEY_HOST') ?? 'localhost';
    const valkeyPort = config.get<number>('VALKEY_PORT') ?? 6379;
    logger.debug({
      msg: 'connecting to valkey',
      port: valkeyPort,
      host: valkeyHost,
    });
    try {
      return new Valkey({
        host: valkeyHost,
        port: valkeyPort,
      });
    } catch (e) {
      logger.error('failed to connect to valkey');
      throw e;
    }
  },
  inject: [ConfigService],
  scope: Scope.DEFAULT,
};

/**
 * CacheModule configured for this application.
 */
export const configuredCacheModule: DynamicModule = CacheModule.register({
  isGlobal: true,
  ttl: 1000 * 15, // 15 seconds
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const logger = new Logger('cacheModule');
    const valkeyHost = config.get<string>('VALKEY_HOST') ?? 'localhost';
    const valkeyPort = config.get<number>('VALKEY_PORT') ?? 6379;
    logger.debug('setting up valkey keyv as primary cache');
    return {
      stores: [
        new KeyvValkey({
          host: valkeyHost,
          port: valkeyPort,
        }),
      ],
    };
  },
});
