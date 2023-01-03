export enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
  cacaoPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité cacao par tasse',
  milkPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité lait par tasse',
}

export type AlimentationQuantities = {
  [quantityKey in keyof typeof QuantitiesMapping]: number;
};

export enum FootprintsMapping {
  groundedCoffee = 'alimentation . boisson . tasse de café . empreinte café moulu',
  infusedTea = 'alimentation . boisson . tasse de thé . empreinte thé infusé',
  cacaoPowder = 'alimentation . boisson . tasse de chocolat chaud . empreinte cacao en poudre',
  cowMilk = 'alimentation . empreinte lait de vache',
  sojaMilk = 'alimentation . empreinte lait de soja',
  oatsMilk = "alimentation . empreinte lait d'avoine",
  waterBottle = 'alimentation . boisson . eau en bouteille . empreinte',
  sodas = 'alimentation . boisson . sucrées . facteur sodas',
  fruitsJuice = 'alimentation . boisson . sucrées . facteur jus de fruits',
  sirops = 'alimentation . boisson . sucrées . facteur sirops',
  beer = 'alimentation . boisson . alcool . facteur bière',
  cocktail = 'alimentation . boisson . alcool . facteur coktail',
  veganMeal = 'alimentation . plats . végétalien . empreinte',
  vegetarianMeal = 'alimentation . plats . végétarien . empreinte',
  whiteMeatMeal = 'alimentation . plats . viande 1 . empreinte',
  redMeatMeal = 'alimentation . plats . viande 2 . empreinte',
  fishMeal = 'alimentation . plats . poisson 1 . empreinte',
  whiteFishMeal = 'alimentation . plats . poisson 2 . nombre',
  continentalBreakfast = 'alimentation . petit déjeuner . continental',
  cowMilkCerealBreakfast = 'alimentation . petit déjeuner . lait vache céréales',
  sojaMilkCerealBreakfast = 'alimentation . petit déjeuner . lait soja céréales',
  oatsMilkCerealBreakfast = 'alimentation . petit déjeuner . lait avoine céréales',
  britishBreakfast = 'alimentation . petit déjeuner . britannique',
  veganBreakfast = 'alimentation . petit déjeuner . végétalien',
}

export type AlimentationFootprints = {
  [footprintKey in keyof typeof FootprintsMapping]: number;
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
  [multiplierKey in keyof typeof MultipliersMapping]: number;
};

export interface AlimentationData {
  quantities: AlimentationQuantities;
  footprints: AlimentationFootprints;
  multipliers: AlimentationMultipliers;
}
