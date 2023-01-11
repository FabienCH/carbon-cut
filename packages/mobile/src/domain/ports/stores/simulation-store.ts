export const SimulationStoreToken = Symbol.for('SimulationStore');

export interface SimulationStore {
  setFootprint: (footprint: number) => void;
}
