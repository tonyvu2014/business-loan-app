import { Injectable } from '@nestjs/common';
import { DecisionRequestDTO } from './dto/decision-request.dto';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { AccountingService } from '../accounting/accounting.service';
import { ProfitOrLossSummaryDTO } from 'src/accounting/dto/profit-or-loss-summary.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanApplication } from '../models/LoanApplication';
import { Repository } from 'typeorm';
import { DecisionOutcome } from '../common/constant';

@Injectable()
export class DecisionService {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly httpService: HttpService,
    @InjectRepository(LoanApplication)
    private readonly loanApplicationRepository: Repository<LoanApplication>,
  ) {}

  async requestOutcome(request: OutcomeRequestDTO): Promise<string> {
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
    const outcome = await this.getOutcome(decisionRequestDTO);

    await this.loanApplicationRepository.save({
      businessAbn: request.abn,
      businessName: request.name,
      yearEstablished: request.yearEstablished,
      loanAmount: request.loanAmount,
      accountingProvider: request.accountingProvider,
      status: outcome === DecisionOutcome.APPROVED ? 'APPROVED' : 'REJECTED',
    });

    return outcome;
  }

  async getOutcome(decisionRequest: DecisionRequestDTO): Promise<string> {
    const url = process.env.DECISION_ENGINE_OUTCOME_URL;
    const { data } = await firstValueFrom(
      this.httpService.post<string>(url, { data: decisionRequest }),
    );
    return data;
  }
}
