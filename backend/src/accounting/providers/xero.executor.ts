import { BalanceSheetDTO } from '../dto/balance-sheet.dto';
import { Executor } from './executor.interface';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

// Integration with XERO as the accouting provider
export class XeroExecutor implements Executor {
  constructor(private readonly httpService: HttpService) {}

  async fetchBalanceSheet(abn: string): Promise<BalanceSheetDTO[]> {
    const url = process.env.XERO_GET_BALANCE_SHEET_URL;
    const { data } = await firstValueFrom(
      this.httpService.get<BalanceSheetDTO[]>(url, { params: { abn } }),
    );

    return data;
  }
}
