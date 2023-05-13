export interface IUser {
  id?: number;
  login: string;
  email: string;
  password: string;
  actions?: any[]
}
