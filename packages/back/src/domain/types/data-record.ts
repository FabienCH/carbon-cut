import { FormulaValue } from '../entities/formula';

export type DataRecord = Record<string, (Record<string, unknown> | string) & { formule?: FormulaValue }>;
