import { Ping } from './pings.entity';

describe('PingsEntity', () => {
  it('should have a Title and a Creation Date', () => {
    const { Title, CreatedOn } = new Ping('hello, world', new Date(), false);
    expect(Title).toBe('hello, world');
    expect(CreatedOn).toBeDefined();
  });

  describe('acknowledgement', () => {
    it('should allow ack to change its acknowledgement status', () => {
      const got = new Ping('hello, world', new Date(), false);
      expect(got.IsAcknowledged).toBe(false);
      got.ack();
      expect(got.IsAcknowledged).toBe(true);
    });

    it('should not allow ack to change its acknowledgement status if already acknowledged', () => {
      const got = new Ping('hello, world', new Date(), true);
      expect(got.IsAcknowledged).toBe(true);
      got.ack();
      expect(got.IsAcknowledged).toBe(true);
    });
  });
});
