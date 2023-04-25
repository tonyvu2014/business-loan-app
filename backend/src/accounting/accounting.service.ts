import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountingProvider } from '../models/AccountingProvider';
import { Repository } from 'typeorm';
import { Executor } from './providers/executor.interface';
import { XeroExecutor } from './providers/xero.executor';
import { MYOBExecutor } from './providers/myob.executor';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';
import { DEFAULT_PRE_ASSESSMENT_VALUE } from '../common/constant';
import { ProfitOrLossSummaryDTO } from './dto/profit-or-loss-summary.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(AccountingProvider)
    private readonly accountingProviderRepository: Repository<AccountingProvider>,
    private readonly httpService: HttpService,
  ) {}

  getProviders(): Promise<AccountingProvider[]> {
    return this.accountingProviderRepository.find();
  }

  getProviderExecutor(provider: string): Executor {
    switch (provider.toLowerCase()) {
      case 'myob':
        return new MYOBExecutor(this.httpService);
      case 'xero':
        return new XeroExecutor(this.httpService);
      default:
        throw new Error('Provider not found');
    }
  }

  async fetchBalanceSheet(
    provider: string,
    abn: string,
  ): Promise<BalanceSheetDTO[]> {
    const executor = this.getProviderExecutor(provider);
    return await executor.fetchBalanceSheet(abn);
  }

  summarizeProfitOrLoss(sheet: BalanceSheetDTO[]): ProfitOrLossSummaryDTO[] {
    const profitOrLossSummary: ProfitOrLossSummaryDTO[] = [];
    sheet.forEach((item) => {
      const year = item.year;
      const index = profitOrLossSummary.findIndex((p) => p.year === year);
      if (index === -1) {
        profitOrLossSummary.push({ year, profitOrLoss: item.profitOrLoss });
      } else {
        profitOrLossSummary[index].profitOrLoss += item.profitOrLoss;
      }
    });
    return profitOrLossSummary;
  }

  computePreAssessment(sheet: BalanceSheetDTO[], loanAmount: number): number {
    //compute profit or loss for the last 12 months and average it
    const profitOrLossByMonth: { [key: string]: number } = {};
    const assetsValueByMonth: { [key: string]: number } = {};

    sheet.forEach((item) => {
      const year = item.year;
      const month = item.month;

      profitOrLossByMonth[`${year}/${month}`] = item.profitOrLoss;
      assetsValueByMonth[`${year}/${month}`] = item.assetsValue;
    });

    let last12MonthsProfitOrLoss = 0;
    let last12MonthsAssetsValue = 0;

    for (let i = 1; i <= 12; i++) {
      const current: Date = new Date();
      current.setMonth(current.getMonth() - i);
      const year: number = current.getFullYear();
      const month: number = current.getMonth();
      const key = `${year}/${month}`;
      last12MonthsProfitOrLoss += profitOrLossByMonth[key] || 0;
      last12MonthsAssetsValue += assetsValueByMonth[key] || 0;
    }

    if (last12MonthsProfitOrLoss <= 0) {
      return DEFAULT_PRE_ASSESSMENT_VALUE;
    }

    const averageAssetsValue = last12MonthsAssetsValue / 12;

    if (averageAssetsValue >= loanAmount) {
      return 100;
    }

    const preAssessment = (averageAssetsValue / loanAmount) * 100;

    return Number(preAssessment.toFixed(2));
  }
}
