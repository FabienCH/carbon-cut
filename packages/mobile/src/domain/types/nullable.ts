export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};
