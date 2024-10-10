export type SafeError = {
  success: false;
  error: string;
};

export type SafeData<T> = {
  success: true;
  data: T;
};

export type Safe<T> = SafeError | SafeData<T>;
