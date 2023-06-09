import { ApiProperty } from '@nestjs/swagger';
import { BalanceSheetDTO } from '../../accounting/dto/balance-sheet.dto';

export class OutcomeRequestDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  abn: string;

  @ApiProperty()
  yearEstablished: number;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  accountingProvider: string;

  @ApiProperty({
    isArray: true,
    type: BalanceSheetDTO,
  })
  balanceSheet: BalanceSheetDTO[];
}
