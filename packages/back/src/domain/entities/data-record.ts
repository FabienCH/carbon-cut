import { FormulaValue } from './formula';

export type DataRecord = Record<string, (Record<string, unknown> | string) & { formule?: FormulaValue }>;
