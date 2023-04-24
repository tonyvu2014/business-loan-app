import { BalanceSheetDTO } from '../dto/balance-sheet.dto';

// An interface for integration with accounting providers
export interface Executor {
  fetchBalanceSheet(abn: string): Promise<BalanceSheetDTO[]>;
}
