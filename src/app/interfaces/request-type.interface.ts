export interface RequestType {
  id: string;
  dateCreated: string;
  rowVersion: string;
  name: string;
  template: string;
  isDeleted: boolean;
  isActive: boolean;
  isSystem: boolean;
}

export interface RequestTypeRequest {
  id: string;
  dateCreated: string;
  rowVersion: string;
  name: string;
  template: string;
  isDeleted: boolean;
  isActive: boolean;
}
