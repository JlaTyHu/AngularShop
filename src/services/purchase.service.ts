
import { Injectable } from '@angular/core';
import { ProductItem } from '../models/product-item';
import { ReplaySubject } from 'rxjs';
import { IUser } from 'src/interfaces/user';
import { IProductComments } from 'src/interfaces/product-comments';
import { IQuestion } from 'src/interfaces/question';
import { IAnswer } from 'src/interfaces/answer';
import { SnackbarService } from 'src/services/snackbar.service';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  user: ReplaySubject<IUser> = new ReplaySubject<IUser>(1);
  product: ReplaySubject<ProductItem> = new ReplaySubject<ProductItem>(1);

  constructor(private snackService: SnackbarService) { }

  get _currentUser(): IUser {
    const users = JSON.parse(localStorage.getItem('users') ?? '[]');
    const accountId = JSON.parse(localStorage.getItem('accountId') ?? '0');
    const user = users.find((user: IUser) => user.id == accountId);
    return user;
  }

  buyGood(item: ProductItem) {
    const user = this._currentUser;
    user.purchasedGoods.push(item);
    let users: IUser[] = JSON.parse(localStorage.getItem('users') ?? '[]');
    users = users.filter((userFilter: IUser) => userFilter.id != user.id);
    users.push(user);

    let products = JSON.parse(localStorage.getItem('items') ?? '[]');
    products = products.filter((productFind: ProductItem) => productFind.productId != item.productId);
    item.numberOfPurchases += 1;
    item.quantityOfGoods -= 1;
    item.whoIsPurchased.push({ id: user.id, login: user.login });
    products.push(item);

    JSON.stringify(localStorage.setItem('items', JSON.stringify(products)));
    JSON.stringify(localStorage.setItem('users', JSON.stringify(users)));
    this.user.next(user);
    this.product.next(item);
    this.snackService.showMessage('Ви успішно купили товар');
  }

  reviewItem(item: ProductItem, commentText: string, rating: number) {
    let products = JSON.parse(localStorage.getItem('items') ?? '[]');
    products = products.filter((productFind: ProductItem) => productFind.productId != item.productId);

    const user = this._currentUser;
    const author = { id: user.id, login: user.login };
    const dateCreate = new Date();

    const productComment: IProductComments = {
      author,
      commentText,
      rating,
      isBought: true,
      dateCreate
    };

    item.comments.push(productComment);
    if (item.rating.number) {
      item.rating.number = (productComment.rating + item.rating.number) / 2;
    } else {
      item.rating.number = productComment.rating;
    }
    item.rating.userIdWhoVoted.push(user.id);

    products.push(item);
    JSON.stringify(localStorage.setItem('items', JSON.stringify(products)));
    this.product.next(item);
    this.snackService.showMessage('Ваш відгук опубліковано!');
  }

  askQuestion(item: ProductItem, questionMessage: string) {
    let products = JSON.parse(localStorage.getItem('items') ?? '[]');
    products = products.filter((productFind: ProductItem) => productFind.productId != item.productId);

    const user = this._currentUser;
    const author = { id: user.id, login: user.login };
    const dateCreate = new Date();

    const questionId = item.questions.length + 1;

    const question: IQuestion = {
      questionId,
      author,
      dateCreate,
      answers: [],
      messageText: questionMessage,
      isCreateAnswerMode: false,
      tempQuestionText: '',
      isAnswerReviewMode: false
    };

    item.questions.push(question);

    products.push(item);
    JSON.stringify(localStorage.setItem('items', JSON.stringify(products)));
    this.product.next(item);
    this.snackService.showMessage('Ваше запитання опубліковано!');
  }

  askAnswer(item: ProductItem, questionId: number, answerMessage: string) {
    let products = JSON.parse(localStorage.getItem('items') ?? '[]');
    products = products.filter((productFind: ProductItem) => productFind.productId != item.productId);

    const user = this._currentUser;
    const author = { id: user.id, login: user.login };
    const dateCreate = new Date();

    const question: any = item.questions.find((questionFind: IQuestion) => questionFind.questionId == questionId);
    item.questions = item.questions.filter((questionFilter: IQuestion) => questionFilter.questionId != question.questionId);

    const answerId = question.answers.length + 1;

    const answer: IAnswer = {
      answerId,
      author,
      dateCreate,
      messageText: answerMessage,
      isCreateAnswerMode: false
    };
    question.answers.push(answer);

    item.questions.push(question);
    products.push(item);
    JSON.stringify(localStorage.setItem('items', JSON.stringify(products)));
    this.product.next(item);
    this.snackService.showMessage('Ваша відповідь опублікована!');
  }
}
