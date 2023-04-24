import { firstValueFrom } from 'rxjs';
import { BalanceSheetDTO } from '../dto/balance-sheet.dto';
import { Executor } from './executor.interface';
import { HttpService } from '@nestjs/axios';

// Integration with MYOB as the accouting provider
export class MYOBExecutor implements Executor {
  constructor(private readonly httpService: HttpService) {}

  async fetchBalanceSheet(abn: string): Promise<BalanceSheetDTO[]> {
    const url = process.env.MYOB_GET_BALANCE_SHEET_URL;
    const { data } = await firstValueFrom(
      this.httpService.get<BalanceSheetDTO[]>(url, { params: { abn } }),
    );

    return data;
  }
}
