import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrencyService } from '../currency/currency.service';

// export class CurrencyService {
//   async getCurrency(currency: string): Promise<any> {}
// }

@Injectable()
export class ExchangeService {
  constructor (private currencyService: CurrencyService){}

  async convertAmount({ from, to, amount }) :Promise<any> {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }
    
    try {
      const currFrom = await this.currencyService.getCurrency(from);
      const currTo = await this.currencyService.getCurrency(to);

      return { amount: (currFrom.value / currTo.value) * amount };
    } catch (error) {
      new Error(error);
    }
  }
};
