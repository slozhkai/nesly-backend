import { UserGender } from '../enums/user.enum';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  gender: UserGender;
}
