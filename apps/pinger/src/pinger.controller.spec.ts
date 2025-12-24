import { Test, TestingModule } from '@nestjs/testing';
import { PingerController } from './pinger.controller';
import { PingerService } from './pinger.service';

describe('PingerController', () => {
  let pingerController: PingerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PingerController],
      providers: [PingerService],
    }).compile();

    pingerController = app.get<PingerController>(PingerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pingerController.getHello()).toBe('Hello World!');
    });
  });
});
