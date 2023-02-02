import { BeverageTypes, BreakfastTypes, FoodTypes, MilkTypes } from 'carbon-cut-commons';
import { AlimentationFootprintsMappingType } from '../../types/alimentation-types';

export enum QuantitiesMapping {
  coffeePerCup = 'alimentation . boisson . tasse de café . quantité café par tasse',
  teaPerCup = 'alimentation . boisson . tasse de thé . quantité thé par tasse',
  cacaoPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité cacao par tasse',
  milkPerCup = 'alimentation . boisson . tasse de chocolat chaud . quantité lait par tasse',
}

export const AlimentationFootprintsMapping: AlimentationFootprintsMappingType = {
  cowMilkCerealBreakfast: 'alimentation . petit déjeuner . lait vache céréales',
  sojaMilkCerealBreakfast: 'alimentation . petit déjeuner . lait soja céréales',
  oatsMilkCerealBreakfast: 'alimentation . petit déjeuner . lait avoine céréales',
  [BreakfastTypes.continentalBreakfast]: 'alimentation . petit déjeuner . continental',
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
  [BeverageTypes.waterBottle]: 'alimentation . boisson . eau en bouteille . empreinte',
  [BeverageTypes.sodas]: 'alimentation . boisson . sucrées . facteur sodas',
  [BeverageTypes.fruitsJuice]: 'alimentation . boisson . sucrées . facteur jus de fruits',
  [BeverageTypes.sirops]: 'alimentation . boisson . sucrées . facteur sirops',
  [BeverageTypes.beer]: 'alimentation . boisson . alcool . facteur bière',
  [BeverageTypes.cocktail]: 'alimentation . boisson . alcool . facteur coktail',
  [BeverageTypes.wine]: 'alimentation . boisson . alcool . facteur vin',
  [MilkTypes.cowMilk]: 'alimentation . empreinte lait de vache',
  [MilkTypes.sojaMilk]: 'alimentation . empreinte lait de soja',
  [MilkTypes.oatsMilk]: "alimentation . empreinte lait d'avoine",
};

export enum MultipliersMapping {
  localFoodReductionPercent = 'alimentation . local . niveau',
  localMealReductionPercent = 'alimentation . local . part locale',
  seasonMealReductionPercent = 'alimentation . de saison . niveau',
  seasonMealRatio = 'alimentation . de saison . niveau',
  seasonablePercent = 'alimentation . de saison . pourcentage saisonable',
  teaHeatingPercent = 'alimentation . boisson . tasse de thé . part consommation empreinte thé infusé',
}
