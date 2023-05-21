import { IAnswer } from './answer';

export interface IQuestion {
  questionId: number;
  author: { id: number, login: string };
  messageText: string;
  dateCreate: Date;
  answers: IAnswer[];
  isCreateAnswerMode: boolean;
  tempQuestionText: string;
  isAnswerReviewMode: boolean;
}