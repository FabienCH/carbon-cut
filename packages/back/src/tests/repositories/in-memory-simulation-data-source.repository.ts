import { SimulationDataSourceRepository } from '../../domain/ports/repositories/simulation-datasource.repository';
import { DataRecord } from '../../domain/types/data-record';

export class InMemorySimulationDataSourceRepository implements SimulationDataSourceRepository {
  constructor(private readonly returnIncorrectData = false) {}

  readonly #alimentationDataToImport: DataRecord = {
    'alimentation . boisson': { icônes: '🥤', formule: { somme: ['chaude', 'froide'] } },
    'alimentation . boisson . chaude': {
      mosaique: {
        type: 'nombre',
        clé: 'nombre',
        suggestions: {
          'pas de boisson chaude': { 'café . nombre': 0, 'thé . nombre': 0, 'chocolat chaud . nombre': 0 },
          'un café par jour': { 'café . nombre': 7 },
          'beaucoup de café': { 'café . nombre': 28 },
          'un café et un thé par jour': { 'café . nombre': 7, 'thé . nombre': 7 },
          'un chocolat chaud le matin': { 'chocolat chaud . nombre': 7 },
        },
      },
      question: 'Quelle est votre consommation de boissons chaudes pour une semaine type (nombre de tasses par semaine)?',
      titre: 'Empreinte boissons chaudes par semaine',
      icônes: '☕️🫖',
      formule: 'par semaine * nombre de semaines',
      unité: 'kgCO2e',
    },
    'alimentation . boisson . chaude . par semaine': { formule: { somme: ['café', 'thé', 'chocolat chaud'], unité: 'kgCO2e/semaine' } },
    'alimentation . boisson . chaude . café': { titre: 'Café', icônes: '☕', formule: 'tasse de café * nombre', unité: 'kgCO2e' },
    'alimentation . boisson . chaude . thé': { titre: 'Thé', icônes: '🫖', formule: 'tasse de thé * nombre', unité: 'kgCO2e' },
    'alimentation . boisson . chaude . chocolat chaud': {
      titre: 'Chocolat chaud',
      icônes: '🥛🍫',
      formule: 'tasse de chocolat chaud * nombre',
      unité: 'kgCO2e',
    },
    'alimentation . boisson . chaude . café . nombre': {
      question: 'Nombre de cafés par semaine',
      'par défaut': 7,
      unité: 'tasse',
      période: 'semaine',
    },
    'alimentation . boisson . chaude . thé . nombre': {
      question: 'Nombre de thés par semaine',
      'par défaut': 7,
      unité: 'tasse',
      période: 'semaine',
    },
    'alimentation . boisson . chaude . chocolat chaud . nombre': {
      question: 'Nombre de chocolats chauds par semaine',
      'par défaut': 0,
      unité: 'tasse',
      période: 'semaine',
    },
    'alimentation . boisson . tasse de café': {
      titre: "Empreinte d'une tasse de café",
      formule: 'empreinte café moulu * quantité café par tasse',
      unité: 'kgCO2e/tasse',
    },
    'alimentation . boisson . tasse de café . empreinte café moulu': {
      formule: 10.09,
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18003#Caf%C3%A9,_moulu'],
    },
    'alimentation . boisson . tasse de café . quantité café par tasse': {
      formule: 0.012,
      unité: 'kg/tasse',
    },
    'alimentation . boisson . tasse de thé': {
      titre: "Empreinte d'une tasse de thé",
      formule: 'empreinte thé infusé sans consommation * quantité thé par tasse',
      unité: 'kgCO2e/tasse',
    },
    'alimentation . boisson . tasse de thé . empreinte thé infusé sans consommation': {
      formule: 'empreinte thé infusé * (1 - part consommation empreinte thé infusé)',
      unité: 'kgCO2e/kg',
    },
    'alimentation . boisson . tasse de thé . empreinte thé infusé': {
      formule: 0.04,
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18020#Th%C3%A9_infus%C3%A9,_non_sucr%C3%A9'],
    },
    'alimentation . boisson . tasse de thé . part consommation empreinte thé infusé': {
      formule: '25%',
      références: ['https://agribalyse.ademe.fr/app/aliments/18020#Th%C3%A9_infus%C3%A9,_non_sucr%C3%A9'],
    },
    'alimentation . boisson . tasse de thé . quantité thé par tasse': {
      formule: 0.25,
      unité: 'kg/tasse',
    },
    'alimentation . boisson . tasse de chocolat chaud': {
      titre: "Empreinte d'une tasse de chocolat chaud",
      formule: { somme: ['empreinte cacao en poudre * quantité cacao par tasse', 'empreinte lait * quantité lait par tasse'] },
      unité: 'kgCO2e/tasse',
    },
    'alimentation . boisson . tasse de chocolat chaud . empreinte cacao en poudre': {
      formule: 27.06,
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18100#Cacao,_non_sucr%C3%A9,_poudre_soluble'],
    },
    'alimentation . boisson . tasse de chocolat chaud . quantité cacao par tasse': {
      formule: 0.02,
      unité: 'kg/tasse',
    },
    'alimentation . boisson . tasse de chocolat chaud . empreinte lait': {
      formule: {
        variations: [
          { si: "type de lait = 'lait de vache'", alors: 'empreinte lait de vache' },
          { si: "type de lait = 'lait de soja'", alors: 'empreinte lait de soja' },
          { si: "type de lait = 'lait d'avoine'", alors: "empreinte lait d'avoine" },
        ],
      },
      unité: 'kgCO2e/kg',
    },
    'alimentation . type de lait': {
      'applicable si': {
        'une de ces conditions': ['boisson . chaude . chocolat chaud . nombre > 0', "petit déjeuner . type = 'lait céréales'"],
      },
      question: "Le lait que vous consommez est-il d'origine animale ou végétale ?",
      'par défaut': "'lait de vache'",
      formule: { 'une possibilité': { 'choix obligatoire': 'oui', possibilités: ['lait de vache', 'lait de soja', "lait d'avoine"] } },
    },
    'alimentation . type de lait . lait de vache': { titre: 'Lait de vache' },
    'alimentation . type de lait . lait de soja': { titre: 'Lait de soja' },
    "alimentation . type de lait . lait d'avoine": { titre: "Lait de d'avoine" },
    'alimentation . empreinte lait de vache': {
      formule: 1.32,
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/19042#Lait_demi-%C3%A9cr%C3%A9m%C3%A9,_pasteuris%C3%A9'],
    },
    'alimentation . empreinte lait de soja': {
      formule: 0.44,
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18900#Boisson_au_soja,_nature'],
    },
    "alimentation . empreinte lait d'avoine": {
      titre: "lait d'avoine",
      formule: 0.54,
      unité: 'kgCO2e/kg',
      références: ["https://agribalyse.ademe.fr/app/aliments/18905#Boisson_à_base_d'avoine,_nature"],
    },
    'alimentation . boisson . tasse de chocolat chaud . quantité lait par tasse': {
      formule: 0.2,
      unité: 'kg/tasse',
    },
    'alimentation . boisson . froide': { icônes: '🍺🥤🧴', formule: { somme: ['sucrées', 'alcool', 'eau en bouteille'] } },
    'alimentation . boisson . eau en bouteille': { 'applicable si': 'affirmatif', formule: 'consommation annuelle * empreinte' },
    'alimentation . boisson . eau en bouteille . consommation annuelle': {
      formule: '365 * 1.5',
      unité: 'l',
    },
    'alimentation . boisson . eau en bouteille . empreinte': {
      formule: 0.27,
      unité: 'kgCO2e/l',
      références: ['https://agribalyse.ademe.fr/app/aliments/18430#Eau_embouteillée_de_source'],
    },
    'alimentation . boisson . eau en bouteille . affirmatif': {
      titre: 'Eau en bouteille',
      question: 'Buvez-vous votre eau en bouteille ?',
      'par défaut': 'non',
    },
    'alimentation . boisson . sucrées': {
      unité: 'kgCO2e',
      formule: 'litres * nombre de semaines * facteur',
    },
    'alimentation . boisson . sucrées . facteur': {
      formule: '(facteur sodas + facteur jus de fruits + facteur sirops) / 3',
    },
    'alimentation . boisson . sucrées . facteur sodas': {
      formule: 0.51,
      unité: 'kgCO2e/l',

      reference: ['https://agribalyse.ademe.fr/app/aliments/18037#Cola,_sucr%C3%A9,_avec_%C3%A9dulcorants'],
    },
    'alimentation . boisson . sucrées . facteur jus de fruits': {
      formule: 0.91,
      unité: 'kgCO2e/l',

      reference: ['https://agribalyse.ademe.fr/app/aliments/2069#Jus_multifruit,_%C3%A0_base_de_concentr%C3%A9,_standard'],
    },
    'alimentation . boisson . sucrées . facteur sirops': {
      formule: 0.1,
      unité: 'kgCO2e/l',

      reference: [
        "https://agribalyse.ademe.fr/app/aliments/18058#Boisson_pr%C3%A9par%C3%A9e_%C3%A0_partir_de_sirop_%C3%A0_diluer_type_menthe,_fraise,_etc,_sucr%C3%A9,_dilu%C3%A9_dans_l'eau",
      ],
    },
    'alimentation . boisson . sucrées . litres': {
      titre: 'Consommation de boissons sucrées',
      question: 'Quelle est votre consommation par semaine de sodas, jus de fruit, sirops, etc. ?',
      suggestions: { nulle: '0 l/semaine', modérée: '1 l/semaine', importante: '5 l/semaine' },
      'par défaut': '2 l/semaine',
    },
    'alimentation . boisson . alcool': {
      unité: 'kgCO2e',

      formule: 'litres * nombre de semaines * facteur',
    },
    'alimentation . boisson . alcool . facteur': {
      formule: '(facteur bière + facteur vin + facteur coktail) / 3',
    },
    'alimentation . boisson . alcool . facteur bière': {
      formule: 1.12,
      unité: 'kgCO2e/l',

      reference: ['https://agribalyse.ademe.fr/app/aliments/5001#Bi%C3%A8re_%22coeur_de_march%C3%A9%22_(4-5%C2%B0_alcool)'],
    },
    'alimentation . boisson . alcool . facteur vin': {
      formule: 1.22,
      unité: 'kgCO2e/l',

      reference: ['https://agribalyse.ademe.fr/app/aliments/5215#Vin_blanc_sec'],
    },
    'alimentation . boisson . alcool . facteur coktail': {
      formule: 0.91,
      unité: 'kgCO2e/l',

      reference: ['https://agribalyse.ademe.fr/app/aliments/1012#Cocktail_%C3%A0_base_de_rhum'],
    },
    'alimentation . boisson . alcool . litres': {
      titre: "Consommation d'alcool",
      question: "Quelle est votre consommation par semaine d'alcool (vin, bière, etc.) ?",
      suggestions: { nulle: 0, modérée: 0.5, importante: 2 },
      unité: 'l/semaine',
      'par défaut': '1 l/semaine',
    },
    alimentation: {
      titre: 'Alimentation',
      couleur: '#e58e26',
      abréviation: 'alim.',
      icônes: '🍴',

      formule: { somme: ['repas', 'boisson', 'déchets'] },
    },
    'alimentation . repas': { formule: { somme: ['petit déjeuner annuel', 'déjeuner et dîner', 'bonus'] } },
    'alimentation . bonus': { formule: { somme: ['de saison . empreinte', 'local . empreinte'] } },
    'alimentation . laitages': {},
    'alimentation . déjeuner et dîner': {
      icônes: '🍽️',
      titre: 'Déjeuners et dîners',
      formule: 'par semaine * nombre de semaines',
      unité: 'kgCO2e',
    },
    'alimentation . déjeuner et dîner . par semaine': { titre: 'Déjeuners et dîners par semaine', formule: 'plats' },
    'alimentation . plats': {
      résumé: '**6 repas** représentatifs de notre consommation\n',
      mosaique: {
        type: 'nombre',
        clé: 'nombre',
        total: 14,
        suggestions: {
          'je suis végétalien': { 'végétalien . nombre': 14 },
          'je suis végétarien': { 'végétalien . nombre': 3, 'végétarien . nombre': 11 },
          'je mange peu de viande': {
            'végétalien . nombre': 1,
            'végétarien . nombre': 7,
            'viande 1 . nombre': 4,
            'poisson 1 . nombre': 1,
            'poisson 2 . nombre': 1,
          },
          'je mange de la viande régulièrement': {
            'végétarien . nombre': 4,
            'viande 1 . nombre': 6,
            'viande 2 . nombre': 2,
            'poisson 1 . nombre': 1,
            'poisson 2 . nombre': 1,
          },
          'je mange beaucoup de viande': {
            'viande 1 . nombre': 6,
            'viande 2 . nombre': 6,
            'poisson 1 . nombre': 1,
            'poisson 2 . nombre': 1,
          },
        },
      },
      question: 'Choisissez les plats de vos midis et dîners pour une semaine type',
      titre: 'Empreinte de 14 repas',
      formule: { somme: ['viande 1', 'viande 2', 'végétalien', 'végétarien', 'poisson 1', 'poisson 2'] },
    },
    'alimentation . plats . végétalien': {
      titre: 'Végétalien',
      formule: 'empreinte * nombre',
      icônes: '🌾🥜🥗',
    },
    'alimentation . plats . végétalien . empreinte': {
      titre: "Empreinte d'un repas végétalien",
      formule: 0.785,
      unité: 'kgCO2e',
    },
    'alimentation . plats . végétalien . nombre': {
      question: 'Nombre de plats végétaliens par semaine',
      'par défaut': 0,
      période: 'semaine',
    },
    'alimentation . plats . végétarien': {
      titre: 'Végétarien',
      formule: 'empreinte * nombre',
      icônes: '🥗🍳🧀',
    },
    'alimentation . plats . végétarien . empreinte': {
      titre: "Empreinte d'un repas végétarien",
      formule: 1.115,
      unité: 'kgCO2e',
    },
    'alimentation . plats . végétarien . nombre': {
      question: 'Nombre de plats végétariens par semaine',
      'par défaut': 5,
      période: 'semaine',
    },
    'alimentation . plats . viande 1': {
      titre: 'Viande 1',
      icônes: '🍗🥓🧀',
      formule: 'empreinte * nombre',
    },
    'alimentation . plats . viande 1 . empreinte': {
      titre: "Empreinte d'un repas de type viande 1 (poulet, porc, fromage)",
      formule: 2.098,
      unité: 'kgCO2e',
    },
    'alimentation . plats . viande 1 . nombre': { question: 'Nombre de plats viande 1 par semaine', 'par défaut': 5, période: 'semaine' },
    'alimentation . plats . viande 2': {
      titre: 'viande 2',
      icônes: '🥩🍖',
      formule: 'empreinte * nombre',
    },
    'alimentation . plats . viande 2 . empreinte': {
      titre: "Empreinte d'un repas de type viande 2 (boeuf, veau, agneau)",
      formule: 5.51,
      unité: 'kgCO2e',
    },
    'alimentation . plats . viande 2 . nombre': { question: 'Nombre de plats viande 2 par semaine', 'par défaut': 2, période: 'semaine' },
    'alimentation . nombre de plats viande': { formule: 'plats . viande 1 . nombre + plats . viande 2 . nombre' },
    'alimentation . plats . poisson 1': {
      formule: 'empreinte * nombre',
      icônes: '🍣🥧',
    },
    'alimentation . plats . poisson 1 . empreinte': {
      titre: "Empreinte d'un repas de type poisson 1 (thon, saumon, sardine, maquereau)",
      formule: 1.63,
      unité: 'kgCO2e',
    },
    'alimentation . plats . poisson 1 . nombre': {
      question: 'Nombre de plats poisson 1 par semaine',
      'par défaut': 2,
      période: 'semaine',
    },
    'alimentation . plats . poisson 2': {
      titre: 'Poisson 2',
      formule: 'empreinte * nombre',
      icônes: '🐟🍚',
    },
    'alimentation . plats . poisson 2 . empreinte': {
      titre: "Empreinte d'un repas de type poisson blanc",
      formule: 2.368,
      unité: 'kgCO2e',
    },
    'alimentation . plats . poisson 2 . nombre': {
      question: 'Nombre de plats poisson 2 par semaine',
      'par défaut': 0,
      période: 'semaine',
    },
    'alimentation . nombre de plats poisson': { formule: 'plats . poisson 1 . nombre + plats . poisson 2 . nombre' },
    'alimentation . planétaire': {
      icônes: '🥗',
    },
    'alimentation . petit déjeuner annuel': { titre: 'Petit déjeuner', icônes: '🥐', formule: 'petit déjeuner * 365' },
    'alimentation . petit déjeuner . par semaine': {
      titre: 'Empreinte hebdo petit déjeuner',
      formule: 'alimentation . petit déjeuner * 7',
    },
    'alimentation . petit déjeuner': {
      formule: {
        variations: [
          { si: "type = 'continental'", alors: 'continental' },
          { si: "type = 'lait céréales'", alors: 'lait céréales' },
          { si: "type = 'britannique'", alors: 'britannique' },
          { si: "type = 'végétalien'", alors: 'végétalien' },
          { sinon: 0 },
        ],
      },
    },
    'alimentation . petit déjeuner . type': {
      question: 'Quel petit déjeuner vous correspond le plus ?',

      'par défaut': "'continental'",
      formule: {
        'une possibilité': {
          'choix obligatoire': 'oui',
          possibilités: ['continental', 'lait céréales', 'britannique', 'végétalien', 'aucun'],
        },
      },
    },
    'alimentation . petit déjeuner . continental': {
      titre: 'Continental',
      formule: 0.289,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . lait céréales': {
      titre: 'Céréales avec lait végétal',
      formule: {
        variations: [
          { si: "type de lait = 'lait de vache'", alors: 'lait vache céréales' },
          { si: "type de lait = 'lait de soja'", alors: 'lait soja céréales' },
          { si: "type de lait = 'lait d'avoine'", alors: 'lait avoine céréales' },
        ],
      },
    },
    'alimentation . petit déjeuner . lait vache céréales': {
      titre: 'Céréales avec lait de vache',
      formule: 0.468,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . lait soja céréales': {
      titre: 'Céréales avec lait de soja',
      formule: 0.292,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . lait avoine céréales': {
      titre: "Céréales avec lait d'avoine",
      formule: 0.312,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . britannique': {
      titre: 'Britannique',
      formule: 1.124,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . végétalien': {
      titre: 'Végétalien',
      formule: 0.419,
      unité: 'kgCO2e',
    },
    'alimentation . petit déjeuner . type . continental': {
      icônes: '🥐🥖',
      titre: 'Viennoiserie et baguette',
    },
    'alimentation . petit déjeuner . type . lait céréales': {
      icônes: '🥣🎑',
      titre: 'Lait et céréales',
    },
    'alimentation . petit déjeuner . type . britannique': {
      titre: 'Salé (type britannique)',
      icônes: '🍳🥓',
    },
    'alimentation . petit déjeuner . type . végétalien': {
      titre: 'Fruits',
      icônes: '🍌🍎',
    },
    'alimentation . petit déjeuner . type . aucun': {
      titre: "Pas de petit-dej'",
      icônes: '❌',
    },
    'alimentation . local': { icone: '🍅🇫🇷' },
    'alimentation . local . empreinte': {
      titre: 'Bonus régime local',
      'non applicable si': "consommation = 'jamais'",
      formule: '0 - niveau * part locale annuelle',
      unité: 'kgCO2e',
    },
    'alimentation . local . consommation': {
      question: 'Consommez-vous des produits locaux ?',

      'par défaut': "'jamais'",
      'une possibilité': { 'choix obligatoire': 'oui', possibilités: ['jamais', 'parfois', 'souvent', 'oui toujours'] },
    },
    'alimentation . local . consommation . jamais': { titre: 'Jamais' },
    'alimentation . local . consommation . parfois': { titre: 'Parfois' },
    'alimentation . local . consommation . souvent': { titre: 'Souvent' },
    'alimentation . local . consommation . oui toujours': { titre: 'Oui toujours' },
    'alimentation . local . niveau': {
      unité: '',
      formule: {
        variations: [
          { si: "consommation = 'oui toujours'", alors: '100%' },
          { si: "consommation = 'souvent'", alors: '66.6%' },
          { si: "consommation = 'parfois'", alors: '33.3%' },
        ],
      },
    },
    'alimentation . local . part locale annuelle': { formule: 'part locale * nombre de semaines' },
    'alimentation . local . part locale': {
      unité: 'kgCO2e',
      formule: {
        somme: [
          'alimentation . plats . végétalien * 12%',
          'alimentation . plats . végétarien * 8%',
          'alimentation . plats . viande 1 * 3%',
          'alimentation . plats . viande 2 * 1%',
          'alimentation . plats . poisson 1 * 5%',
          'alimentation . plats . poisson 2 * 6%',
          'alimentation . petit déjeuner . par semaine * 8%',
        ],
      },
    },
    'alimentation . de saison': { icone: '🍅🌞' },
    'alimentation . de saison . empreinte': {
      titre: 'Bonus régime de saison',
      'non applicable si': "consommation = 'jamais'",
      formule: 'facteur de saison * part saisonable',
    },
    'alimentation . de saison . facteur de saison': { formule: '(-1) * niveau / ratio' },
    'alimentation . de saison . consommation': {
      question: 'Consommez-vous des produits de saison ?',

      'par défaut': "'jamais'",
      formule: { 'une possibilité': { 'choix obligatoire': 'oui', possibilités: ['jamais', 'parfois', 'souvent', 'oui toujours'] } },
    },
    'alimentation . de saison . consommation . jamais': { titre: 'Jamais' },
    'alimentation . de saison . consommation . parfois': { titre: 'Parfois' },
    'alimentation . de saison . consommation . souvent': { titre: 'Souvent' },
    'alimentation . de saison . consommation . oui toujours': { titre: 'Oui toujours' },
    'alimentation . de saison . niveau': {
      formule: {
        variations: [
          { si: "consommation = 'oui toujours'", alors: '100%' },
          { si: "consommation = 'souvent'", alors: '66.6%' },
          { si: "consommation = 'parfois'", alors: '33.3%' },
        ],
      },
    },
    'alimentation . de saison . ratio': {
      formule: 2.26,
    },
    'alimentation . de saison . part saisonable': {
      formule: 'pourcentage saisonable * (petit déjeuner annuel + déjeuner et dîner)',
      unité: 'kgCO2e',
    },
    'alimentation . de saison . pourcentage saisonable': {
      titre: "Pourcentage saisonable de l'empreinte moyenne",
      formule: '7.3%',
    },
  };

  readonly #transportDataToImport: DataRecord = {
    'transport . empreinte': {
      titre: 'Transport',
      formule: {
        somme: ['voiture . empreinte', 'avion', 'deux roues thermique', 'bus', 'train', 'métro ou tram', 'vélo', 'vacances'],
      },
    },
    'transport . vacances': {
      mosaique: {
        type: 'selection',
        clé: 'propriétaire',
      },
      question: 'Que possédez-vous pour vos week-ends, vos vacances ?',
      icônes: '🏖',
      formule: {
        somme: ['caravane . empreinte . usage réel', 'camping car . empreinte . usage réel', 'van', 'maison secondaire'],
      },
    },
    'transport . vacances . maison secondaire': {
      titre: 'Maison secondaire',
      icônes: '🏠',
      'applicable si': 'propriétaire',
      formule: 0,
    },
    'transport . vacances . maison secondaire . propriétaire': {
      question: 'Possédez-vous une maison secondaire ?',
      'par défaut': 'non',
      inactif: 'oui',
    },
    'transport . vacances . van': {
      titre: 'Van',
      icônes: '🚐',
      'applicable si': 'propriétaire',
      formule: 0,
    },
    'transport . vacances . van . propriétaire': {
      question: 'Possédez-vous un van ?',
      'par défaut': 'non',
      inactif: 'oui',
    },
    'transport . train': {
      titre: 'Train',
      icônes: '🚋',
      formule: 'km * impact par km',
    },
    'transport . train . impact par km': {
      formule: '(TER + TGV) / 2',
      unité: 'kgCO2e/km',
    },
    'transport . train . TER': {
      formule: 0.0296,
      unité: 'kgCO2e/km',
    },
    'transport . train . TGV': {
      formule: 0.00236,
      unité: 'kgCO2e/km',
    },
    'transport . train . km': {
      question: 'Combien de kilomètres parcourez-vous en train par an ?',
      suggestions: {
        "traversée d'une région": 300,
        'Paris↔Lyon': 800,
        'Brest↔Nice': 2400,
        '💳 grand voyageur plus ultra': 10000,
      },
      unité: 'km/an',
      'par défaut': '1000 km/an',
    },
    'transport . métro ou tram': {
      titre: 'Métro ou tramway',
      icônes: '🚊',
      formule: 'heures par semaine * impact par heure * nombre de semaines',
    },
    'transport . métro ou tram . impact par heure': {
      formule: 'impact par km * vitesse',
      unité: 'kgCO2e/h',
    },
    'transport . métro ou tram . impact par km': {
      formule: 0.00329,
      unité: 'kgCO2e/km',
    },
    'transport . métro ou tram . vitesse': {
      formule: 25,
      unité: 'km/h',
    },
    'transport . métro ou tram . heures par semaine': {
      question: "Combien d'heures passez-vous par semaine en métro ou en tram ?",
      suggestions: {
        zéro: 0,
        '1h / jour': 7,
        '2h / jour': 14,
      },
      unité: 'h/semaine',
      'par défaut': '3 h/semaine',
    },
    'transport . bus': {
      titre: 'Bus',
      icônes: '🚌',
      formule: 'heures par semaine * impact par heure * nombre de semaines',
    },
    'nombre de semaines': {
      formule: 52,
      unité: 'semaine',
    },
    'transport . bus . impact par heure': {
      formule: 'impact par km * vitesse',
      unité: 'kgCO2e/h',
    },
    'transport . bus . impact par km': {
      formule: 0.113,
      unité: 'kgCO2e/km',
    },
    'transport . bus . vitesse': {
      formule: 12,
      unité: 'km/h',
    },
    'transport . bus . heures par semaine': {
      question: "Combien d'heures passez-vous dans un bus par semaine ?",
      suggestions: {
        zéro: 0,
        '1h / jour': 7,
        '2h / jour': 14,
      },
      unité: 'h/semaine',
      'par défaut': '3 h/semaine',
    },
    'transport . vélo': {
      titre: 'Vélo',
      'applicable si': 'km',
      icônes: '🚲',
      formule: 'empreinte * km',
    },
    'transport . vélo . empreinte': {
      formule: 0,
      unité: 'kgCO2e/km',
    },
    'transport . vélo . km': {
      titre: 'Kilomètres à vélo',
      question: 'Combien de kilomètres de vélo ou marche faites-vous par semaine ?',
      suggestions: {
        'zéro ou presque': '0 km',
        '5km par jour': '35 km',
        '10km par jour': '70 km',
      },
      'par défaut': '5 km',
    },
    'transport . deux roues thermique': {
      icônes: '🛵',
      'applicable si': 'usager',
      formule: 'empreinte * km',
    },
    'transport . deux roues thermique . usager': {
      question: 'Utilisez-vous un scooter ou une moto ?',
      'par défaut': 'non',
    },
    'transport . deux roues thermique . km': {
      question: "Combien de km faites-vous à l'année avec votre scooter ou moto ?",
      'par défaut': '1000 km',
    },
    'transport . deux roues thermique . type': {
      question: 'Quel type de deux roues thermique utilisez-vous ?',
      'applicable si': 'usager',
      'par défaut': "'scooter'",
      formule: {
        'une possibilité': {
          'choix obligatoire': 'oui',
          possibilités: ['scooter', 'moto inf 250', 'moto sup 250'],
        },
      },
    },
    'transport . deux roues thermique . type . scooter': {
      titre: 'Scooter',
    },
    'transport . deux roues thermique . type . moto inf 250': {
      titre: 'Moto moins de 250 cm3',
    },
    'transport . deux roues thermique . type . moto sup 250': {
      titre: 'Moto plus de 250 cm3',
    },
    'transport . deux roues thermique . empreinte': {
      formule: {
        variations: [
          {
            si: "type = 'scooter'",
            alors: '0.0763 kgCO2e/km',
          },
          {
            si: "type = 'moto inf 250'",
            alors: '0.0763 kgCO2e/km',
          },
          {
            si: "type = 'moto sup 250'",
            alors: '0.191 kgCO2e/km',
          },
        ],
      },
    },
    'transport . deux roues thermique . conso': {
      formule: {
        variations: [
          {
            si: "type = 'scooter'",
            alors: '2.3 / 100 l/km',
          },
          {
            si: "type = 'moto inf 250'",
            alors: '2.2 / 100 l/km',
          },
          {
            si: "type = 'moto sup 250'",
            alors: '6 / 100 l/km',
          },
        ],
      },
    },
    'transport . voiture': {
      formule: 'oui',
      icônes: '🚘️',
    },
    'transport . voiture . empreinte': {
      résumé: "Le premier poste moyen d'empreinte, l'incontournable **voiture individuelle**",
      titre: 'voiture',
      icônes: '🚘️',
      'non applicable si': 'km = 0',
      formule: {
        variations: [
          {
            si: 'voiture . aide km',
            alors: 'construction amortie / ratio voyageurs + usage',
          },
          {
            sinon: '(construction amortie + usage) / voyageurs',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . voyageurs': {
      question: 'Quel est le nombre moyen de voyageurs dans la voiture ?',
      'par défaut': '1.2 voyageurs',
      unité: 'voyageurs',
      suggestions: {
        'un seul': 1,
        deux: 2,
        cinq: 5,
      },
    },
    'transport . voiture . notif minimum voyageurs': {
      type: 'notification',
      sévérité: 'invalide',
      formule: 'voyageurs = 0',
    },
    'transport . voiture . aide km': {
      question:
        "L'utilisateur a-t-il été assisté pour remplir son nombre de kilomètres en voiture, ce nombre étant alors déjà proratisé par le nombre de voyageur pour chaque trajet ?",
      'par défaut': 'non',
    },
    'transport . voiture . ratio voyageurs': {
      question:
        "Si l'utilisateur a été assisté pour remplir son nombre de kilomètres, quel est le rapport entre la somme brute des kilomètres, et la somme des kilomètres divisés par le nombre de voyageur du trajet ?",
      'par défaut': 1,
    },
    'transport . voiture . km': {
      titre: 'Km en voiture',
      question: "Quelle distance parcourez-vous à l'année en voiture ?",
      'par défaut': '12200 km/an',
      suggestions: {
        zéro: '0 km/an',
        vacances: '2000 km/an',
        '10km / jour': '3600 km/an',
        '1000km / mois': '12000 km/an',
        '20 000km / an': '20000 km/an',
      },
    },
    'transport . voiture . motorisation': {
      question: 'Quel type de voiture utilisez-vous ?',
      'par défaut': "'thermique'",
      formule: {
        'une possibilité': {
          'choix obligatoire': 'oui',
          possibilités: ['thermique', 'hybride', 'électrique'],
        },
      },
    },
    'transport . voiture . motorisation . thermique': {
      titre: 'Thermique (diesel/essence)',
    },
    'transport . voiture . motorisation . électrique': {
      titre: 'Électrique',
    },
    'transport . voiture . motorisation . hybride': {
      titre: 'Hybride',
    },
    'transport . voiture . thermique': 'oui',
    'transport . voiture . gabarit': {
      'applicable si': 'km > 0',
      question: 'Quel est le gabarit de la voiture ?',
      'par défaut': "'moyenne'",
      formule: {
        'une possibilité': {
          'choix obligatoire': 'oui',
          possibilités: ['petite', 'moyenne', 'berline', 'SUV'],
        },
      },
    },
    'transport . voiture . gabarit . petite': {
      titre: 'Petite',
    },
    'transport . voiture . gabarit . moyenne': {
      titre: 'Moyenne',
    },
    'transport . voiture . gabarit . berline': {
      titre: 'Berline',
    },
    'transport . voiture . gabarit . SUV': {
      titre: 'SUV',
    },
    'transport . voiture . thermique . consommation aux 100': {
      question: 'Connaissez-vous la consommation moyenne de la voiture ?',
      'par défaut': 'consommation estimée',
      unité: 'l/centkm',
    },
    'transport . voiture . consommation estimée': {
      formule: {
        variations: [
          {
            si: "gabarit = 'petite'",
            alors: '5 l/centkm',
          },
          {
            si: "gabarit = 'moyenne'",
            alors: '6 l/centkm',
          },
          {
            si: "gabarit = 'berline'",
            alors: '7 l/centkm',
          },
          {
            si: "gabarit = 'SUV'",
            alors: '8 l/centkm',
          },
        ],
      },
    },
    'transport . voiture . thermique . consommation au kilomètre': {
      formule: 'consommation aux 100 / 100',
      unité: 'l/km',
    },
    'transport . voiture . thermique . empreinte au kilomètre': {
      titre: 'empreinte au km thermique',
      formule: 'consommation au kilomètre * empreinte au litre',
    },
    'transport . voiture . électrique': 'oui',
    'transport . voiture . électrique . empreinte au kilomètre': {
      titre: 'empreinte au km électrique',
      unité: 'kgCO2e/km',
      formule: {
        variations: [
          {
            si: "gabarit = 'petite'",
            alors: 0.0159,
          },
          {
            si: "gabarit = 'moyenne'",
            alors: 0.0198,
          },
          {
            sinon: 0.0273,
          },
        ],
      },
    },
    'transport . voiture . empreinte . usage': {
      formule: 'km * au kilomètre',
      unité: 'kgCO2e',
    },
    'transport . voiture . empreinte . par km personne': {
      formule: 'au kilomètre / voyageurs',
    },
    'transport . voiture . empreinte . au kilomètre': {
      formule: {
        variations: [
          {
            si: "motorisation = 'thermique'",
            alors: 'thermique . empreinte au kilomètre',
          },
          {
            si: "motorisation = 'hybride'",
            alors: 'thermique . empreinte au kilomètre * 0.85',
          },
          {
            sinon: 'électrique . empreinte au kilomètre',
          },
        ],
      },
    },
    'transport . voiture . thermique . empreinte au litre': {
      formule: {
        variations: [
          {
            si: "carburant = 'gazole B7 ou B10'",
            alors: '(3.1 + 3.04) / 2',
          },
          {
            si: "carburant = 'essence E5 ou E10'",
            alors: 2.7,
          },
          {
            si: "carburant = 'essence E85'",
            alors: 1.11,
          },
        ],
      },
      unité: 'kgCO2e/l',
    },
    'transport . voiture . thermique . carburant': {
      question: 'Quel type de carburant votre voiture consomme-t-elle ?',
      'par défaut': "'essence E5 ou E10'",
      formule: {
        'une possibilité': {
          'choix obligatoire': 'oui',
          possibilités: ['gazole B7 ou B10', 'essence E5 ou E10', 'essence E85'],
        },
      },
    },
    'transport . voiture . thermique . carburant . gazole B7 ou B10': {
      titre: 'Gazole (B7 ou B10)',
    },
    'transport . voiture . thermique . carburant . essence E5 ou E10': {
      titre: 'Essence (E5 ou E10)',
    },
    'transport . voiture . thermique . carburant . essence E85': {
      titre: 'Essence E85 (biocarburants)',
    },
    'transport . voiture . notif carburant': {
      type: 'notification',
      formule: "thermique . carburant = 'essence E85'",
    },
    'transport . voiture . empreinte . construction': {
      formule: {
        variations: [
          {
            si: "motorisation = 'thermique'",
            alors: 'barème thermique',
          },
          {
            si: "motorisation = 'électrique'",
            alors: 'barème électrique',
          },
          {
            sinon: 'barème hybride',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . empreinte . construction . barème thermique': {
      formule: {
        variations: [
          {
            si: {
              'une de ces conditions': ["gabarit = 'petite'", "gabarit = 'moyenne'"],
            },
            alors: '6700 - 1100',
          },
          {
            si: {
              'une de ces conditions': ["gabarit = 'berline'", "gabarit = 'SUV'"],
            },
            alors: '7600 - 1300',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . empreinte . construction . barème électrique': {
      formule: {
        variations: [
          {
            si: {
              'une de ces conditions': ["gabarit = 'petite'", "gabarit = 'moyenne'"],
            },
            alors: '10200 - 2200',
          },
          {
            si: {
              'une de ces conditions': ["gabarit = 'berline'", "gabarit = 'SUV'"],
            },
            alors: '20200 - 6600',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . empreinte . construction . barème hybride': {
      formule: {
        variations: [
          {
            si: {
              'une de ces conditions': ["gabarit = 'petite'", "gabarit = 'moyenne'"],
            },
            alors: '9600 - 2000',
          },
          {
            si: {
              'une de ces conditions': ["gabarit = 'berline'", "gabarit = 'SUV'"],
            },
            alors: '6900 - 2400',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . gabarit . petite . poids': {
      formule: 1138,
      unité: 'kg',
    },
    'transport . voiture . gabarit . petite . empreinte': {
      formule: 5600,
      unité: 'kgCO2e',
    },
    'transport . voiture . gabarit . berline . poids': {
      formule: 1500,
      unité: 'kg',
    },
    'transport . voiture . gabarit . berline . empreinte': {
      formule: 6300,
      unité: 'kgCO2e',
    },
    'transport . voiture . âge': {
      'applicable si': {
        'toutes ces conditions': ['km > 0', 'propriétaire'],
      },
      question: "Quel est l'âge de votre voiture ?",
      unité: 'années',
      'par défaut': '9 années',
      suggestions: {
        '6 mois': 0.5,
        '1 an et demi': 1.5,
        '5 ans': 5,
        '10 ans': 10,
      },
    },
    'transport . voiture . empreinte . construction amortie': {
      formule: {
        variations: [
          {
            si: 'propriétaire',
            alors: 'construction * amortissement particulier',
          },
          {
            sinon: '(construction / durée de vie) * facteur location',
          },
        ],
      },
      unité: 'kgCO2e',
    },
    'transport . voiture . amortissement particulier': {
      formule: {
        variations: [
          {
            si: 'âge < 1',
            alors: '40%',
          },
          {
            si: 'âge < 2',
            alors: '20%',
          },
          {
            si: 'âge < 3',
            alors: '10%',
          },
          {
            si: 'âge < 10',
            alors: '5%',
          },
          {
            sinon: '0%',
          },
        ],
      },
    },
    'transport . voiture . durée de vie': {
      formule: 19,
    },
    'transport . voiture . facteur location': {
      formule: 'km / 16300',
    },
    'transport . voiture . propriétaire': {
      question: 'Avez-vous votre propre voiture individuelle ?',
      'par défaut': 'oui',
    },
    'transport . voiture . notif proprio': {
      type: 'notification',
      formule: {
        'toutes ces conditions': ['propriétaire = non', 'km > 0'],
      },
    },
  };

  readonly #dataToIgnore: DataRecord = {
    'alimentation . boisson . tasse de café . quantité café par tasse': {
      formule: 'a string formula',
      unité: 'kg/tasse',
    },
    'alimentation . boisson . tasse de café . empreinte café moulu': {
      formule: { object: 'object formula' },
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18003#Caf%C3%A9,_moulu'],
    },
    'alimentation . local . part locale': {
      résumé: '**6 repas** représentatifs de notre consommation\n',
      mosaique: {
        type: 'nombre',
        clé: 'nombre',
        total: 14,
      },
      question: 'Choisissez les plats de vos midis et dîners pour une semaine type',
      titre: 'Empreinte de 14 repas',
      formule: { somme: ['viande 1', 'viande 2', 'végétalien', 'végétarien', 'poisson 1', 'poisson 2'] },
    },
  };

  async getBySector(): Promise<DataRecord> {
    return this.returnIncorrectData ? this.#dataToIgnore : { ...this.#alimentationDataToImport, ...this.#transportDataToImport };
  }
}
