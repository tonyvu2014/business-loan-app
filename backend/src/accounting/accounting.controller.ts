import { Controller, Get, Query } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';
import { AccountingProvider } from 'src/models/AccountingProvider';
import { ApiQuery } from '@nestjs/swagger';

@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('providers')
  getProviders(): Promise<AccountingProvider[]> {
    return this.accountingService.getProviders();
  }

  @Get('balance_sheet')
  @ApiQuery({ name: 'provider', required: true })
  @ApiQuery({ name: 'abn', required: true })
  fetchBalanceSheet(
    @Query() query: { provider: string; abn: string },
  ): Promise<BalanceSheetDTO[]> {
    return this.accountingService.fetchBalanceSheet(query.provider, query.abn);
  }
}
