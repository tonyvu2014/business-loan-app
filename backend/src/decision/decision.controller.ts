import { Body, Controller, Post } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('decision')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post('outcome')
  @ApiBody({ type: OutcomeRequestDTO })
  async requestOutcome(
    @Body() request: OutcomeRequestDTO,
  ): Promise<{ outcome: string }> {
    return { outcome: await this.decisionService.requestOutcome(request) };
  }
}
