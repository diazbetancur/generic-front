export interface FrequentQuestion {
  id: string;
  dateCreated: string;
  rowVersion: string;
  question: string;
  response: string;
}

export interface FrequentQuestionRequest {
  id?: string;
  dateCreated: string;
  rowVersion: string;
  question: string;
  response: string;
}

