import { ApiProperty } from '@nestjs/swagger';

export class BalanceSheetDTO {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  profitOrLoss: number;

  @ApiProperty()
  assetsValue: number;
}
