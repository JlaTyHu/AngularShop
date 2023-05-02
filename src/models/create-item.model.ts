import { IProductRating } from '../interfaces/product-rating';
import { IProductComments } from '../interfaces/product-comments';

export class CreateItemModel {
  productName!: string;
  productRating!: IProductRating;
  authorId!: number;
  comments!: IProductComments[];
  productImages!: string[];

  constructor() { }
}
