import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('loan_application', { schema: 'demyst' })
export class LoanApplication {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'business_name', length: 200 })
  businessName: string;

  @Column('varchar', { name: 'business_abn', length: 20 })
  businessAbn: string;

  @Column('decimal', { name: 'loan_amount', precision: 15, scale: 2 })
  loanAmount: string;

  @Column('enum', {
    name: 'status',
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'],
    default: () => "'DRAFT'",
  })
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

  @Column('year', { name: 'year_established', nullable: true })
  yearEstablished: number | null;

  @Column('varchar', { name: 'accounting_provider', length: 100 })
  accountingProvider: string;
}
