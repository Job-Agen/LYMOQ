# LYMOQ — Flutter mobile sandbox prototype

Prototype Flutter fidèle à la maquette fournie : onboarding, Home, création progressive de carte (Where / Amount / Usage / Duration), review, financement Mobile Money simulé, confirmation, création de carte, détails de carte et activité.

## Important

Cette version est un **sandbox UI fonctionnel** :

- aucun argent réel n'est déplacé ;
- aucune carte Visa/Mastercard réelle n'est émise ;
- aucun PIN Mobile Money n'est demandé ;
- le financement est simulé ;
- les numéros de carte affichés sont masqués/fictifs.

## Stack

- Flutter / Dart
- Material 3 avec design system LYMOQ personnalisé
- aucune dépendance métier externe : le prototype reste léger

## Structure

```text
lib/
  main.dart
  app.dart
  models/
  state/
  theme/
  widgets/
  screens/
docs/
  reference_prototype.png
```

## Démarrage sur Windows

Le bundle contient le code Flutter mais pas les dossiers Android/iOS générés par le SDK, car l'environnement de génération ne dispose pas du SDK Flutter.

1. Installe Flutter et Android Studio si nécessaire.
2. Ouvre PowerShell dans ce dossier.
3. Exécute :

```powershell
flutter create --platforms=android,ios --org com.lymoq.app .
flutter pub get
flutter analyze
flutter test
flutter run
```

Ou lance :

```powershell
.\scripts\bootstrap_windows.bat
```

## Parcours testable

1. Get started
2. Create a card
3. Choisir Anywhere ou Specific merchant
4. Choisir le montant
5. Choisir le nombre de paiements
6. Choisir la durée
7. Review card
8. Fund card
9. Choisir TMoney / Flooz / Moov Money
10. La confirmation sandbox prend environ 3 secondes
11. La carte est ajoutée à l'application
12. Ouvrir Card details
13. Freeze / Unfreeze / Terminate
14. Voir Activity
15. Ouvrir la transaction Google bloquée pour afficher Payment blocked

## Design

La palette et la hiérarchie sont centralisées dans `lib/theme/lymoq_theme.dart`.

Couleurs principales :

- Forest : `#073D31`
- CTA green : `#005C47`
- Accent : `#008566`
- Mint : `#DFF3E9`
- Background : `#F8FAF7`

La référence visuelle originale est conservée dans `docs/reference_prototype.png`.

## Limite connue

Le SDK Flutter n'étant pas installé dans l'environnement qui a généré ce bundle, je n'ai pas pu exécuter `flutter analyze`, `flutter test` ou produire un APK ici. Les scripts fournis lancent ces validations dès que le projet est ouvert dans un environnement Flutter local.
