import { BeverageTypes, BreakfastTypes, FoodTypes } from 'carbon-cut-types';

export enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
  cacaoPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité cacao par tasse',
  milkPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité lait par tasse',
}

export type AlimentationQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

export type AlimentationFootprintsMappingType = Record<BreakfastTypes | FoodTypes | BeverageTypes, string>;

export const AlimentationFootprintsMapping: AlimentationFootprintsMappingType = {
  [BreakfastTypes.continentalBreakfast]: 'alimentation . petit déjeuner . continental',
  [BreakfastTypes.cowMilkCerealBreakfast]: 'alimentation . petit déjeuner . lait vache céréales',
  [BreakfastTypes.sojaMilkCerealBreakfast]: 'alimentation . petit déjeuner . lait soja céréales',
  [BreakfastTypes.oatsMilkCerealBreakfast]: 'alimentation . petit déjeuner . lait avoine céréales',
  [BreakfastTypes.britishBreakfast]: 'alimentation . petit déjeuner . britannique',
  [BreakfastTypes.veganBreakfast]: 'alimentation . petit déjeuner . végétalien',
  [FoodTypes.veganMeal]: 'alimentation . plats . végétalien . empreinte',
  [FoodTypes.vegetarianMeal]: 'alimentation . plats . végétarien . empreinte',
  [FoodTypes.whiteMeatMeal]: 'alimentation . plats . viande 1 . empreinte',
  [FoodTypes.redMeatMeal]: 'alimentation . plats . viande 2 . empreinte',
  [FoodTypes.fishMeal]: 'alimentation . plats . poisson 1 . empreinte',
  [FoodTypes.whiteFishMeal]: 'alimentation . plats . poisson 2 . empreinte',
  [BeverageTypes.groundedCoffee]: 'alimentation . boisson . tasse de café . empreinte café moulu',
  [BeverageTypes.infusedTea]: 'alimentation . boisson . tasse de thé . empreinte thé infusé',
  [BeverageTypes.cacaoPowder]: 'alimentation . boisson . tasse de chocolat chaud . empreinte cacao en poudre',
  [BeverageTypes.cowMilk]: 'alimentation . empreinte lait de vache',
  [BeverageTypes.sojaMilk]: 'alimentation . empreinte lait de soja',
  [BeverageTypes.oatsMilk]: "alimentation . empreinte lait d'avoine",
  [BeverageTypes.waterBottle]: 'alimentation . boisson . eau en bouteille . empreinte',
  [BeverageTypes.sodas]: 'alimentation . boisson . sucrées . facteur sodas',
  [BeverageTypes.fruitsJuice]: 'alimentation . boisson . sucrées . facteur jus de fruits',
  [BeverageTypes.sirops]: 'alimentation . boisson . sucrées . facteur sirops',
  [BeverageTypes.beer]: 'alimentation . boisson . alcool . facteur bière',
  [BeverageTypes.cocktail]: 'alimentation . boisson . alcool . facteur coktail',
};

export type AlimentationFootprints = {
  [footprintKey in keyof typeof AlimentationFootprintsMapping]: number;
};

export enum MultipliersMapping {
  localFoodReductionPercent = 'alimentation . local . niveau',
  localMealReductionPercent = 'alimentation . local . part locale',
  seasonMealReductionPercent = 'alimentation . de saison . niveau',
  seasonMealRatio = 'alimentation . de saison . niveau',
  seasonablePercent = 'alimentation . de saison . pourcentage saisonable',
  teaHeatingPercent = 'alimentation . boisson . tasse de thé . part consommation empreinte thé infusé',
}

export type AlimentationMultipliers = {
  [multiplierKey in keyof typeof MultipliersMapping]: number | Record<string, number>;
};

export interface AlimentationData {
  quantities: AlimentationQuantities;
  footprints: AlimentationFootprints;
  multipliers: AlimentationMultipliers;
}
