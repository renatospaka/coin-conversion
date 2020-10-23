import { Injectable, InternalServerErrorException } from '@nestjs/common';

export class CurrencyRepository {
  // forces existence of the class while the true class is not created in the project

  async getCurrency(currency: string): Promise<any> {};
}

@Injectable()
export class CurrencyService {
  constructor (private currencyRepository:CurrencyRepository) {};

  async getCurrency(currency: string): Promise<any> {
    try {
      return await this.currencyRepository.getCurrency(currency);
    } catch (error) {
      throw new InternalServerErrorException();
    };
  };
};
