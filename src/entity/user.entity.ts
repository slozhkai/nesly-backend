import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserSex {
  MALE = 'male',
  FEMALE = 'female',
  NOT_DEFINED = 'not_defined',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserSex,
    default: UserSex.NOT_DEFINED,
  })
  sex: UserSex;
}
