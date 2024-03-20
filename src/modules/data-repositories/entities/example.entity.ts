import { BeforeUpdate, Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'examples',
})
export class Example {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column({
    name: 'name',
    length: 256,
  })
  name!: string;

  @Column({
    name: 'description',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @Column({
    name: 'modified_at',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamptz',
  })
  modifiedAt!: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.modifiedAt = new Date();
  }
}
