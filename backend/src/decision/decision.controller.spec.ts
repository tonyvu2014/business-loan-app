import { Test, TestingModule } from '@nestjs/testing';
import { DecisionController } from './decision.controller';
import { DecisionService } from './decision.service';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { BalanceSheetDTO } from '../accounting/dto/balance-sheet.dto';

describe('DecisionController', () => {
  let controller: DecisionController;
  let service: DecisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionController],
      providers: [
        {
          provide: DecisionService,
          useValue: {
            requestOutcome: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DecisionController>(DecisionController);
    service = module.get<DecisionService>(DecisionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestOutcome', () => {
    it('should call requestOutcome() from decisionService with correct parameters', () => {
      const balanceSheet: BalanceSheetDTO[] = [
        {
          year: 2023,
          month: 4,
          profitOrLoss: 90000,
          assetsValue: 13000,
        },
        {
          year: 2023,
          month: 3,
          profitOrLoss: -120000,
          assetsValue: 14000,
        },
      ];
      const request: OutcomeRequestDTO = {
        name: 'test',
        abn: 'abn',
        yearEstablished: 2022,
        loanAmount: 18000,
        accountingProvider: 'XERO',
        balanceSheet: balanceSheet,
      };
      controller.requestOutcome(request);
      expect(service.requestOutcome).toHaveBeenCalledWith(request);
    });
  });
});
