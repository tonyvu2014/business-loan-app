import { generateRandomBalanceSheet } from 'src/common/helper';
import { BalanceSheetDTO } from '../dto/balance-sheet.dto';
import { Executor } from './executor.interface';

// Integration with XERO as the accouting provider
export class XeroExecutor implements Executor {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchBalanceSheet(abn: string): Promise<BalanceSheetDTO[]> {
    return Promise.resolve(generateRandomBalanceSheet());
  }
}
