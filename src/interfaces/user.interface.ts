import { UserSex } from '../enums/user.enum';

export interface UserInterface {
  username: string;
  email: string;
  password: string;
  sex: UserSex;
}
