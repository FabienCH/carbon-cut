# carbon-cut

[![codecov](https://codecov.io/gh/FabienCH/carbon-cut/branch/main/graph/badge.svg?token=6Q5F6OU15P)](https://codecov.io/gh/FabienCH/carbon-cut)

Carbon cut est une application mobile qui vous permet de calculer votre empreinte carbone personnelle. Elle s'appuie pour cela sur les données de lu simmulateur [Nos Gestes Climat](https://nosgestesclimat.fr/) de l'ADEME

L'application est en cours de développement et ne se trouve sur aucun app store actuellement.

### Démarrer l'application localement

Carbon cut est un monorepo utilisant yarn workspace. L'application mobile est développée en React Native et le backend avec NestJS.
Pour démarrer l'application localement vous pouvez exécuter la commande `yarn start` et ensuite lancer l'application sur un simulateur ou votre mobile en scannant le QR Code, après avoir télécharger l'application Expo.

### Test et Lint
Les tests peuvent être lancer avec la commande `yarn test` et le linter avec `yarn lint`
