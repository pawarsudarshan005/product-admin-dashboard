export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

// DummyJSON's /auth/login returns the user fields plus a token.
// Newer versions of the API call it "accessToken" instead of "token",
// so the login response can contain either field.
export interface LoginResponse extends AuthUser {
  token?: string;
  accessToken?: string;
}
