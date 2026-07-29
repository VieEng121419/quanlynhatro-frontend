export interface LoginInput {
  userName: string;
  password: string;
}

export interface AuthUser {
  id: number;
  userName: string;
  fullName: string;
  role: "ADMIN" | "STAFF" | "TENANT" | string;
}

export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginResponseData;
}
