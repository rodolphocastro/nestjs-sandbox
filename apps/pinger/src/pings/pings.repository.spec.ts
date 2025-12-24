import {
  StartedValkeyContainer,
  ValkeyContainer,
} from '@testcontainers/valkey';
import Valkey from 'iovalkey';
import { ValkeyPingsRepository } from './pings.repository';

describe('PingsRepository', () => {
  let valkeyContainer: StartedValkeyContainer;
  let valkeyClient: Valkey;

  beforeAll(async () => {
    const valkeyImage = new ValkeyContainer('valkey/valkey-bundle:8');
    valkeyContainer = await valkeyImage.start();
    valkeyClient = new Valkey({
      host: valkeyContainer.getHost(),
      port: valkeyContainer.getMappedPort(6379),
    });
  });

  beforeEach(async () => {
    // Ensure test failures are not due to connection problems
    await expect(valkeyClient.ping()).resolves.not.toThrow();
    // Deletes all the items under the pings value just in case
    await valkeyClient.del('pings');
  });

  afterAll(async () => {
    await valkeyContainer.stop();
  });

  describe('atomic operations', () => {
    it('should store a single ping into valkey', async () => {
      const sut = new ValkeyPingsRepository(valkeyClient);
      const act = sut.insert({
        Title: 'hello, world',
        CreatedOn: new Date(),
        IsAcknowledged: false,
      });
      await expect(act).resolves.not.toThrow();
    });

    it('should retrieve pings from valkey', async () => {
      const sut = new ValkeyPingsRepository(valkeyClient);
      const got = await sut.listAll();
      expect(got).toBeDefined();
    });
  });

  it('should return what was written after listing', async () => {
    const sut = new ValkeyPingsRepository(valkeyClient);
    const ping = {
      Title: 'hello, world',
      CreatedOn: new Date(),
      IsAcknowledged: false,
    };
    await sut.insert(ping);
    await sut.insert(ping);
    const got = await sut.listAll();
    expect(got).toHaveLength(2);
  });
});
