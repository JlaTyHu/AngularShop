export interface IAnswer {
  answerId: number;
  author: { id: number, login: string };
  messageText: string;
  dateCreate: Date;
  isCreateAnswerMode: boolean;
}