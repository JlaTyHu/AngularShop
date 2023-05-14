import { ProductItem } from "src/models/product-item";

export interface IUser {
  id: number;
  login: any;
  email: string;
  password: string;
  shoppingCart: ProductItem[];
}
