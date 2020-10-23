import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRepository, CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let repository: CurrencyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService, 
        { provide: CurrencyRepository, useFactory: () => ({ getCurrency: jest.fn() }) }
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    repository = module.get<CurrencyRepository>(CurrencyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should be throw if repository breaks', async () => {
      (repository.getCurrency as jest.Mock).mockRejectedValue(new InternalServerErrorException());
      await expect(service.getCurrency('INVALID_CURRENCY'))
        .rejects
        .toThrow(new InternalServerErrorException());
    });

    it('should not be throw if repository returns', async () => {
      await expect(service.getCurrency('USD'))
        .resolves
        .not.toThrow();
    });
  });
});
