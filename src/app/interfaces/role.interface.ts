export interface Permission {
  id: string;
  dateCreated: string;
  rowVersion: string;
  name: string;
  module: string;
  description: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  permissions: Permission[];
  isSystem: boolean;
}

export interface RoleRequest {
  id?: string;
  name: string;
  description: string;
}
