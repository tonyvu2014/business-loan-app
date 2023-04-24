import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/balance-sheet')
  getBalanceSheet(@Query() query: { abn: string }): Promise<BalanceSheetDTO[]> {
    return this.appService.getBalanceSheet(query.abn);
  }
}
