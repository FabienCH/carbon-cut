import { DataRecord } from '../../domain/entities/data-record';
import { SimulationDataRepository } from '../../domain/repositories/simulation-data.repository';

export class InMemorySimulationDataRepository implements SimulationDataRepository {
  constructor(private readonly returnDataToImport = true) {}

  readonly #dataToImport: DataRecord = {
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
  readonly #dataWithIncorrectFormula: DataRecord = {
    'alimentation . boisson . tasse de café . quantité café par tasse': {
      formule: 'a string formula',
      unité: 'kg/tasse',
    },
    'alimentation . boisson . tasse de café . empreinte café moulu': {
      formule: { object: 'object formula' },
      unité: 'kgCO2e/kg',
      références: ['https://agribalyse.ademe.fr/app/aliments/18003#Caf%C3%A9,_moulu'],
    },
  };

  async getBySector(): Promise<DataRecord> {
    return this.returnDataToImport ? this.#dataToImport : this.#dataWithIncorrectFormula;
  }
}
