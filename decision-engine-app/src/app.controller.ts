import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DecisionRequestDTO } from './dto/decision-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('outcome')
  getOutcome(@Body() decisionRequest: DecisionRequestDTO): Promise<string> {
    return this.appService.getOutcome(decisionRequest);
  }
}
