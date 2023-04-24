import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { AccountingModule } from '../accounting/accounting.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from '../models/LoanApplication';

@Module({
  imports: [
    HttpModule,
    AccountingModule,
    TypeOrmModule.forFeature([LoanApplication]),
  ],
  providers: [DecisionService],
  controllers: [DecisionController],
})
export class DecisionModule {}
