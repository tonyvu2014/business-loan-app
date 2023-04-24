import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountingProvider } from 'src/models/AccountingProvider';
import { Repository } from 'typeorm';
import { Executor } from './providers/executor.interface';
import { XeroExecutor } from './providers/xero.executor';
import { MYOBExecutor } from './providers/myob.executor';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';
import { DEFAULT_PRE_ASSESSMENT_VALUE } from 'src/common/constant';
import { ProfitOrLossSummaryDTO } from './dto/profit-or-loss-summary.dto';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(AccountingProvider)
    private readonly accountingProviderRepository: Repository<AccountingProvider>,
  ) {}

  getProviders(): Promise<AccountingProvider[]> {
    return this.accountingProviderRepository.find();
  }

  getProviderExecutor(provider: string): Executor {
    switch (provider.toLowerCase()) {
      case 'myob':
        return new MYOBExecutor();
      case 'xero':
        return new XeroExecutor();
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

    const current: Date = new Date();
    for (let i = 0; i <= 11; i++) {
      current.setMonth(current.getMonth() - i);
      const year: number = current.getFullYear();
      const month: number = current.getMonth();
      const key = `${year}/${month}`;
      last12MonthsProfitOrLoss += profitOrLossByMonth[key] || 0;
      last12MonthsAssetsValue += assetsValueByMonth[key] || 0;
    }

    if (last12MonthsProfitOrLoss < 0) {
      return DEFAULT_PRE_ASSESSMENT_VALUE;
    }

    const averageAssetsValue = last12MonthsAssetsValue / 12;

    if (averageAssetsValue >= loanAmount) {
      return 100;
    }

    return (averageAssetsValue / loanAmount) * 100;
  }
}
