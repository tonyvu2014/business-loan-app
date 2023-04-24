import { Injectable } from '@nestjs/common';
import { DecisionRequestDTO } from './dto/decision-request.dto';
import { DecisionOutcome } from 'src/common/helper';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { AccountingService } from 'src/accounting/accounting.service';
import { ProfitOrLossSummaryDTO } from 'src/accounting/dto/profit-or-loss-summary.dto';

@Injectable()
export class DecisionService {
  constructor(private readonly accountingService: AccountingService) {}

  requestOutcome(request: OutcomeRequestDTO): string {
    console.log('request', request);
    const profitOrLossSummary: ProfitOrLossSummaryDTO[] =
      this.accountingService.summarizeProfitOrLoss(request.balanceSheet);
    const preAssessment = this.accountingService.computePreAssessment(
      request.balanceSheet,
      request.loanAmount,
    );
    const decisionRequestDTO: DecisionRequestDTO = {
      businessDetails: {
        name: request.name,
        abn: request.abn,
        yearEstablished: request.yearEstablished,
        profitOrLossSummary,
      },
      preAssessment: preAssessment,
    };
    return this.getOutcome(decisionRequestDTO);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOutcome(decisionRequest: DecisionRequestDTO): string {
    const possibleOutcomes = Object.keys(DecisionOutcome);
    const randomIndex = Math.floor(Math.random() * possibleOutcomes.length);
    return possibleOutcomes[randomIndex];
  }
}
