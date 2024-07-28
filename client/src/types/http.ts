export type ApiResponse<T> =
  | ({
      success: true;
      message: string;
    } & T)
  | { success: false; message: string; fails?: Object[] };
