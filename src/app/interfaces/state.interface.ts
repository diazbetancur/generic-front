export interface State {
  id: string;
  dateCreated: string;
  rowVersion: string;
  name: string;
  hexColor: string;
  isDeleted: boolean;
  isSystem: boolean;
}

export interface StateRequest {
  id?: string;
  dateCreated: string;
  rowVersion: string;
  name: string;
  hexColor: string;
  isDeleted: boolean;
  isSystem: boolean;
}

