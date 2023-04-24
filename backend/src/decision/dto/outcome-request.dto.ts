import { ApiProperty } from '@nestjs/swagger';
import { BalanceSheetDTO } from 'src/accounting/dto/balance-sheet.dto';

export class OutcomeRequestDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  abn: string;

  @ApiProperty()
  yearEstablished: number;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty({
    isArray: true,
    type: BalanceSheetDTO,
  })
  balanceSheet: BalanceSheetDTO[];
}
