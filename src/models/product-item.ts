import { IProductComments } from '../interfaces/product-comments';

export class ProductItem {
  productId!: number;
  productName!: string;
  description!: string;
  imgSrc!: string;
  price!: number;
  rating?: {
    number: number,
    userIdWhoVoted: number[]
  };
  author?: {
    login?: string;
    id?: number | string;
  };
  comments?: IProductComments[];
  properties!: { name: string, type: string, isEditMode: boolean }[]

  constructor() {
  }
}
