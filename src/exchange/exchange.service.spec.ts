import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../currency/currency.service';
import { ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const currencyServiceMock = {
      getCurrency: jest.fn().mockRejectedValue({ value: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService, 
        { provide: CurrencyService, useFactory: () => currencyServiceMock }
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); 
  });
  
  describe('convertAmount()', () => {
    it('should be throw if called with invalid parameters.', async () => {
      await expect(service.convertAmount({ from: '', to: '', amount: 0}))
        .rejects
        .toThrow(new BadRequestException());
    });

    it('should not be throw if called with valid parameters.', async () => {
      await expect(service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }))
        .resolves
        .not.toThrow();
    });

    it('should call getCurrency twice.', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      await expect(currencyService.getCurrency())
        .toBeCalledTimes(2);
    });

    it('should call getCurrency with correct params.', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      await expect(currencyService.getCurrency()).toBeCalledWith('USD');
      await expect(currencyService.getCurrency()).toHaveBeenLastCalledWith('BRL');
    }); 

    it('should be throw getCurrency breaks.', async () => {
      (currencyService.getCurrency as jest.Mock).mockRejectedValue(new Error());
      await expect(service.convertAmount({ from: 'INVALID_CURRENCY', to: 'BRL', amount: 1 }))
        .rejects
        .toThrow();
    }); 

    it('should be throw converted value.', async () => {
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      expect(await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }))
        .toEqual({ amount: 5 });
    }); 

    it('should be throw converted value.', async () => {
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      expect(await service.convertAmount({ from: 'BRL', to: 'USD', amount: 1 }))
        .toEqual({ amount: 0.2 });
    }); 

    it('should be US 1.00.', async () => {
      (currencyService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      expect(await service.convertAmount({ from: 'USD', to: 'USD', amount: 1 }))
        .toEqual({ amount: 1 });
    }); 
  });
});
