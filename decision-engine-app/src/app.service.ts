import { Injectable } from '@nestjs/common';
import { generateRandomOutcome } from './common/helper';
import { DecisionRequestDTO } from './dto/decision-request.dto';

@Injectable()
export class AppService {
  // a mock function to simulate the decision engine
  // it returns a random outcome
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getOutcome(decisionRequest: DecisionRequestDTO): Promise<string> {
    return Promise.resolve(generateRandomOutcome());
  }
}
