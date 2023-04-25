import { Test, TestingModule } from '@nestjs/testing';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { BalanceSheetDTO } from './dto/balance-sheet.dto';

describe('AccountingController', () => {
  let controller: AccountingController;
  let service: AccountingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountingController],
      providers: [
        {
          provide: AccountingService,
          useValue: {
            getProviders: jest.fn(),
            fetchBalanceSheet: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountingController>(AccountingController);
    service = module.get<AccountingService>(AccountingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProviders', () => {
    it('should call getProviders() from accountingService', async () => {
      await controller.getProviders();
      expect(service.getProviders).toHaveBeenCalled();
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
      jest.spyOn(service, 'getProviders').mockResolvedValue(result);
      expect(await controller.getProviders()).toBe(result);
    });
  });

  describe('fetchBalanceSheet', () => {
    it('should call fetchBalanceSheet() from accountingService with correct parameters', async () => {
      const provider = 'XERO';
      const abn = '1234';
      await controller.fetchBalanceSheet({ provider, abn });
      expect(service.fetchBalanceSheet).toHaveBeenCalledWith(provider, abn);
    });

    it('should return correct an array of BalanceSheetDTO', async () => {
      const provider = 'MYOB';
      const abn = '7890';
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2023,
          month: 4,
          profitOrLoss: 1700000,
          assetsValue: 130000,
        },
        {
          year: 2023,
          month: 3,
          profitOrLoss: 45000,
          assetsValue: 6750,
        },
      ];
      jest.spyOn(service, 'fetchBalanceSheet').mockResolvedValue(balanceSheet);
      const result = await controller.fetchBalanceSheet({ provider, abn });
      expect(result).toEqual(balanceSheet);
    });
  });
});
