export interface IProductComments {
  author: { id: number, login: string };
  commentText: string;
  rating: number;
  isBought: boolean;
  dateCreate: Date;
}
