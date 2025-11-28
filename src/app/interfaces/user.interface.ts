export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  allowedPaths?: string[]; // paths permitidos por token, ej: ['/home', '/admin/users']
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface ForgotPasswordRequest {
  userNameOrEmail: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  maskedEmail: string | null;
  maskedPhone: string | null;
  resetTokenId: string | null;
}

export interface ResetPasswordRequest {
  resetTokenId: string;
  verificationCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
