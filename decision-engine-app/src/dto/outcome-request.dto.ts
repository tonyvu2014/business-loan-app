import { BalanceSheetDTO } from './balance-sheet.dto';

export class OutcomeRequestDTO {
  name: string;

  abn: string;

  yearEstablished: number;

  loanAmount: number;

  balanceSheet: BalanceSheetDTO[];
}
