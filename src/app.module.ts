import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [ExchangeModule, CurrencyModule],
})
export class AppModule {}
