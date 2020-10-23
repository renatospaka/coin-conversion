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
    
    const currFrom = this.currencyService.getCurrency(from);
    const currTo = this.currencyService.getCurrency(to);
  }
};
