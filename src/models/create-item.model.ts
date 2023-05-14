import { IProductRating } from '../interfaces/product-rating';
import { IProductComments } from '../interfaces/product-comments';

export class CreateItemModel {
  productName: string = '';
  productRating: IProductRating = {  totalVotes: 0, currentRating: 0 };
  authorId: number = 0;
  comments: IProductComments[] = [];
  productImages: string[] = [];

  constructor() { }
}
