import { BreakfastTypes } from '../alimentation';
import { Beverages } from '../beverages';

export interface SimulationDto {
  breakfast: BreakfastTypes;
  beverages: Beverages;
}
