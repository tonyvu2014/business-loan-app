import { Body, Controller, Post } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { OutcomeRequestDTO } from './dto/outcome-request.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('decision')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post('outcome')
  @ApiBody({ type: OutcomeRequestDTO })
  requestOutcome(@Body() request: OutcomeRequestDTO): { outcome: string } {
    return { outcome: this.decisionService.requestOutcome(request) };
  }
}
