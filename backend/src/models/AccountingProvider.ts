import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounting_provider', { schema: 'demyst' })
export class AccountingProvider {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;
}
