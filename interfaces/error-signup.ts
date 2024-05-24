export interface ErrorSignUp {
  status: number;
  clerkError: boolean;
  errors: Error[];
}

export interface Error {
  code: string;
  message: string;
  longMessage: string;
  meta: Meta;
}

export interface Meta {
  paramName: string;
}
