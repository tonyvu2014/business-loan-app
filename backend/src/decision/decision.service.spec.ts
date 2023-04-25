import { Test, TestingModule } from '@nestjs/testing';
import { DecisionService } from './decision.service';
import { Repository } from 'typeorm';
import { LoanApplication } from '../models/LoanApplication';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { AccountingService } from '../accounting/accounting.service';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { BalanceSheetDTO } from 'src/accounting/dto/balance-sheet.dto';
import { of } from 'rxjs';
import { DecisionRequestDTO } from './dto/decision-request.dto';

describe('DecisionService', () => {
  let service: DecisionService;
  let repo: Repository<LoanApplication>;
  let httpService: HttpService;
  let accountingService: AccountingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecisionService,
        {
          provide: getRepositoryToken(LoanApplication),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: AccountingService,
          useValue: {
            summarizeProfitOrLoss: jest.fn(),
            computePreAssessment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DecisionService>(DecisionService);
    repo = module.get<Repository<LoanApplication>>(
      getRepositoryToken(LoanApplication),
    );
    httpService = module.get<HttpService>(HttpService);
    accountingService = module.get<AccountingService>(AccountingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestOutcome', () => {
    it('should call summarizeProfitOrLoss(), computePreAssessment() from accountingService, and save() from loanApplicationRepository with correct parameters', async () => {
      jest
        .spyOn(service, 'getOutcome')
        .mockImplementation(() => Promise.resolve('APPROVED'));
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2022,
          month: 12,
          profitOrLoss: 1200000,
          assetsValue: 500000,
        },
      ];
      const request: OutcomeRequestDTO = {
        name: 'test',
        abn: 'abn',
        yearEstablished: 2020,
        loanAmount: 100000,
        accountingProvider: 'MYOB',
        balanceSheet: balanceSheet,
      };
      await service.requestOutcome(request);

      expect(accountingService.summarizeProfitOrLoss).toBeCalledWith(
        request.balanceSheet,
      );
      expect(accountingService.computePreAssessment).toBeCalledWith(
        request.balanceSheet,
        request.loanAmount,
      );
      expect(repo.save).toBeCalledWith(
        expect.objectContaining({
          businessAbn: request.abn,
          businessName: request.name,
          yearEstablished: request.yearEstablished,
          loanAmount: request.loanAmount,
          accountingProvider: request.accountingProvider,
          status: 'APPROVED',
        }),
      );
      expect(service.getOutcome).toBeCalled();
    });

    it('should return the correct value', async () => {
      jest
        .spyOn(service, 'getOutcome')
        .mockImplementation(() => Promise.resolve('APPROVED'));
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2022,
          month: 12,
          profitOrLoss: 1200000,
          assetsValue: 500000,
        },
      ];
      const request: OutcomeRequestDTO = {
        name: 'test',
        abn: 'abn',
        yearEstablished: 2010,
        loanAmount: 700000,
        accountingProvider: 'XERO',
        balanceSheet: balanceSheet,
      };
      const result = await service.requestOutcome(request);
      expect(result).toEqual('APPROVED');
    });
  });

  describe('getOutcome', () => {
    it('should call to httpService.post() and return the correct value', async () => {
      jest.spyOn(httpService, 'post').mockImplementation(
        () =>
          of({
            data: {
              outcome: 'REJECTED',
            },
            headers: {},
            config: {},
            status: 200,
            statusText: 'OK',
          }) as any,
      );
      const decisionRequest: DecisionRequestDTO = {
        businessDetails: {
          name: 'test',
          abn: 'abn',
          yearEstablished: 2010,
          profitOrLossSummary: [
            {
              year: 2022,
              profitOrLoss: 1200000,
            },
          ],
        },
        preAssessment: 60,
      };
      const result = await service.getOutcome(decisionRequest);
      expect(httpService.post).toBeCalled();
      expect(result).toEqual({ outcome: 'REJECTED' });
    });
  });
});
