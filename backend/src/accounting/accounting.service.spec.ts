import { Test, TestingModule } from '@nestjs/testing';
import { AccountingService } from './accounting.service';
import { AccountingProvider } from '../models/AccountingProvider';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';
import { DEFAULT_PRE_ASSESSMENT_VALUE } from '../common/constant';
import { XeroExecutor } from './providers/xero.executor';

describe('AccountingService', () => {
  let service: AccountingService;
  let repo: Repository<AccountingProvider>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountingService,
        {
          provide: getRepositoryToken(AccountingProvider),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountingService>(AccountingService);
    repo = module.get<Repository<AccountingProvider>>(
      getRepositoryToken(AccountingProvider),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProviders', () => {
    it('should call find() from accountingProviderRepository', async () => {
      await service.getProviders();
      expect(repo.find).toHaveBeenCalled();
    });

    it('should return correct an array of AccountingProvider', async () => {
      const result = [
        {
          id: 1,
          name: 'XERO',
        },
        {
          id: 2,
          name: 'MYOB',
        },
      ];
      jest.spyOn(repo, 'find').mockResolvedValue(result);
      expect(await service.getProviders()).toBe(result);
    });
  });

  describe('fetchBalanceSheet', () => {
    it('should call get() from httpService and return correct value', async () => {
      const provider = 'XERO';
      const abn = '1234';
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2019,
          month: 1,
          profitOrLoss: -32000,
          assetsValue: 42000,
        },
        {
          year: 2019,
          month: 2,
          profitOrLoss: 54000,
          assetsValue: 8500,
        },
        {
          year: 2019,
          month: 3,
          profitOrLoss: 0,
          assetsValue: 90678,
        },
      ];
      jest.spyOn(httpService, 'get').mockImplementation(
        () =>
          of({
            data: balanceSheet,
            headers: {},
            config: {},
            status: 200,
            statusText: 'OK',
          }) as any,
      );
      const result = await service.fetchBalanceSheet(provider, abn);
      expect(httpService.get).toBeCalled();
      expect(result).toBe(balanceSheet);
    });
  });

  describe('summarizeProfitOrLoss', () => {
    it('should return correct value', () => {
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2022,
          month: 5,
          profitOrLoss: 1000,
          assetsValue: 2000,
        },
        {
          year: 2021,
          month: 9,
          profitOrLoss: 1350,
          assetsValue: 9000,
        },
        {
          year: 2022,
          month: 11,
          profitOrLoss: -3200,
          assetsValue: 5030,
        },
      ];

      const result = service.summarizeProfitOrLoss(balanceSheet);
      expect(result.length).toBe(2);
      expect(result).toEqual(
        expect.arrayContaining([
          {
            year: 2022,
            profitOrLoss: -2200,
          },
          {
            year: 2021,
            profitOrLoss: 1350,
          },
        ]),
      );
    });
  });

  describe('computePreAssessment', () => {
    it('should return default value if no profit for the last 12 months', () => {
      const balanceSheet: BalanceSheetDTO[] = [];
      for (let i = 1; i <= 12; i++) {
        const current: Date = new Date();
        current.setMonth(current.getMonth() - i);
        const year: number = current.getFullYear();
        const month: number = current.getMonth();
        balanceSheet.push({
          year,
          month,
          profitOrLoss: i % 2 === 0 ? 500 : -1000,
          assetsValue: 100000,
        });
      }
      const result = service.computePreAssessment(balanceSheet, 500000);
      expect(result).toEqual(DEFAULT_PRE_ASSESSMENT_VALUE);
    });

    it('should return 100 if there is profit and average assets value in the last 12 months is greater than the loan amount', () => {
      const balanceSheet: BalanceSheetDTO[] = [];
      for (let i = 1; i <= 12; i++) {
        const current: Date = new Date();
        current.setMonth(current.getMonth() - i);
        const year: number = current.getFullYear();
        const month: number = current.getMonth();
        balanceSheet.push({
          year,
          month,
          profitOrLoss: i % 2 === 0 ? -90000 : 100000,
          assetsValue: i % 2 === 0 ? 50000 : 30000,
        });
      }
      const result = service.computePreAssessment(balanceSheet, 39000);
      expect(result).toEqual(100);
    });

    it('should return correct percentage if there is profit and average assets value in the last 12 months is less than the loan amount', () => {
      const balanceSheet: BalanceSheetDTO[] = [];
      for (let i = 1; i <= 12; i++) {
        const current: Date = new Date();
        current.setMonth(current.getMonth() - i);
        const year: number = current.getFullYear();
        const month: number = current.getMonth();
        balanceSheet.push({
          year,
          month,
          profitOrLoss: i % 2 === 0 ? -90000 : 100000,
          assetsValue: i % 2 === 0 ? 50000 : 30000,
        });
      }
      const loanAmount = 50000;
      const expected = Number(((40000 / loanAmount) * 100).toFixed(2));
      const result = service.computePreAssessment(balanceSheet, loanAmount);
      expect(result).toEqual(expected);
    });
  });

  describe('getProviderExecutor', () => {
    it('should return correct provider executor', () => {
      const provider = 'XERO';
      const result = service.getProviderExecutor(provider);
      expect(result).toBeInstanceOf(XeroExecutor);
    });

    it('should throw error if provider is not supported', () => {
      const provider = 'SOME_PROVIDER';
      expect(() => service.getProviderExecutor(provider)).toThrow(
        'Provider not found',
      );
    });
  });
});
