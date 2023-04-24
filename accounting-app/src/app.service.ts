import { Injectable } from '@nestjs/common';
import { generateRandomBalanceSheet } from './common/helper';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';

@Injectable()
export class AppService {
  // a mock function to simulate the accounting provider
  // it returns a random balance sheet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getBalanceSheet(abn: string): Promise<BalanceSheetDTO[]> {
    return Promise.resolve(generateRandomBalanceSheet());
  }
}
