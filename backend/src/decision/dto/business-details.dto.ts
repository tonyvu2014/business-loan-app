import { ProfitOrLossSummaryDTO } from '../../accounting/dto/profit-or-loss-summary.dto';

export class BusinessDetailsDTO {
  name: string;
  abn: string;
  yearEstablished: number;
  profitOrLossSummary: ProfitOrLossSummaryDTO[];
}
