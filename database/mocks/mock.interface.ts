export type GenerateMock<T> = (count: number, ...args: any[]) => Partial<T>[];
