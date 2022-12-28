export type Formula = number | string | { variations: Array<{ si: string; alors: string }> } | { somme: string[] } | object;

export type DataRecord = Record<string, (Record<string, unknown> | string) & { formule?: Formula }>;
