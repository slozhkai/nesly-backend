import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserSex } from '../enums/user.enum';

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
