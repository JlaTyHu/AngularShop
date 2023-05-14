import { IProductComments } from '../interfaces/product-comments';

export class ProductItem {
  productId: number = 0;
  productName: string = '';
  description: string = '';
  imgSrc: string = '';
  price: number = 0;
  rating!: {
    number: number,
    userIdWhoVoted: number[]
  };
  author: {
    login: any;
    id: number | string;
  } = { login: '', id: 0 } ;
  comments: IProductComments[] = [];
  properties: { name: string, type: string, isEditMode: boolean }[] = [];

  constructor() {
  }
}
