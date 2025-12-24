export interface IPing {
  /**
   * The title of the ping.
   */
  Title: string;

  /**
   * The date the ping was created.
   */
  CreatedOn: Date;

  /**
   * Whether the ping has been acknowledged.
   */
  readonly IsAcknowledged: boolean;
}

/**
 * Entity that represents a ping.
 */
export class Ping implements IPing {
  constructor(
    public readonly Title: string,
    public readonly CreatedOn: Date,
    private isAcked: boolean,
  ) {}

  public get IsAcknowledged(): boolean {
    return this.isAcked;
  }

  ack() {
    this.isAcked = true;
  }
}
