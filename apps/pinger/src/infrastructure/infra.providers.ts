import { Logger, Provider, Scope } from '@nestjs/common';
import Valkey from 'iovalkey';
import { ConfigService } from '@nestjs/config';

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
