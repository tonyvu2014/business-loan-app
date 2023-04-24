import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { AccountingModule } from 'src/accounting/accounting.module';

@Module({
  imports: [AccountingModule],
  providers: [DecisionService],
  controllers: [DecisionController],
})
export class DecisionModule {}
