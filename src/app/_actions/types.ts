export type Result<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
};
