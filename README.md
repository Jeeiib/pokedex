# Pokédex

Application mobile React Native qui liste les 1025 espèces de Pokémon et
affiche la fiche de chacune, à partir de l'API publique
[PokeAPI](https://pokeapi.co/docs/v2). L'interface reprend la maquette Figma
fournie avec le sujet.

## Ce que fait l'application

- **Liste** des 1025 espèces, en trois colonnes, avec recherche par nom ou par
  numéro et tri par numéro ou par nom.
- **Fiche détail** : artwork officiel, types, poids, taille, talents,
  description, et les six statistiques de base sous forme de barres qui se
  remplissent à l'ouverture. Des flèches passent à l'espèce précédente ou
  suivante.
- **Cri du Pokémon** au son, depuis la fiche.
- **Filtre par type** et **favoris** conservés d'une session à l'autre.
- **Mode sombre** au choix : clair, sombre, ou selon le réglage du téléphone.
- **Interface bilingue** français et anglais, y compris les noms des Pokémon et
  les annonces de VoiceOver.
- Toutes les animations respectent le réglage « Réduire les animations ».

## Installation

```bash
npm install
npx expo start
```

Puis scanner le QR code avec l'application Expo Go, ou appuyer sur `i` pour le
simulateur iOS et `a` pour l'émulateur Android.

L'icône et l'écran de démarrage sont des ressources natives : les voir exige une
reconstruction, un rechargement ne suffit pas.

```bash
npx expo run:ios
npx expo run:android
```

## Architecture

Trois couches, dans l'ordre imposé par le cours :

- `src/services/` parle à l'API. Aucun `fetch` n'existe ailleurs dans le projet.
- `src/hooks/` appelle les services et porte les états de chargement et d'erreur.
- `src/components/` et `src/app/` n'affichent que ce que les hooks leur donnent.

La navigation passe par Expo Router : chaque fichier de `src/app/` est un écran,
et `src/app/pokemon/[id].tsx` est la route dynamique de la fiche.

## Écarts au cours, assumés

1. **Hooks écrits à la main plutôt que TanStack Query.** La grille note la
   gestion des états de chargement et d'erreur ; passer par la librairie ferait
   disparaître du code la compétence évaluée.
2. **URL d'artwork dérivée de l'identifiant** plutôt que lue dans la réponse de
   détail : la lire coûterait 1025 requêtes pour une valeur prévisible. Le calcul
   est isolé dans `getArtworkUrl()`, dans `src/utils/`.
3. **Un appel GraphQL** au milieu d'un service REST. PokeAPI n'expose les noms
   traduits en une seule requête que par GraphQL ; la seule solution REST
   demanderait 1025 requêtes. L'appel est isolé dans `getNames()` et reste un
   `fetch` en POST.
4. **Pas de `onEndReached`.** L'index complet pèse 9 Ko et tient en une requête,
   la pagination n'aurait rien à charger. Le rendu, lui, reste paresseux :
   `FlatList` ne monte que les cartes visibles.
5. **Périmètre à 1025 espèces** et non aux 1302 entrées de `/pokemon`, qui
   comptent les formes régionales et les méga-évolutions comme des entrées
   distinctes.

## Écarts à la maquette, et pourquoi

La maquette Figma fournie avec le sujet a servi de point de départ, pas de
contrainte. Chaque écart ci-dessous a été mesuré sur simulateur iOS avant d'être
décidé.

### La typographie suit l'échelle d'iOS, pas celle de la maquette

La maquette place le corps de texte à 10 points et certains libellés à 8. Elle a
été dessinée sur un écran, où l'on regarde à trente centimètres ; un téléphone se
tient à bout de bras. Apple fixe le corps de texte à 17 points et considère 11
comme un plancher. L'application était donc à 59 pour cent de l'échelle système.

Tout le texte a été recalé : corps à 17, nom du Pokémon à 34, libellés à 13. La
description de la fiche passe aussi de justifiée à alignée à gauche : sur une
colonne de quarante caractères, la justification creuse des blancs entre les
mots.

### La police du système remplace Poppins

Poppins est une géométrique dont les accents sont presque verticaux, ce qui rend
le grave et l'aigu difficiles à distinguer en petit corps, sur une application
française. La police du système, SF Pro sur iOS et Roboto sur Android, dessine
des accents lisibles, expose des chiffres tabulaires qui alignent les
statistiques en colonne, et surtout suit nativement le réglage de taille de
texte du téléphone. L'application n'a plus aucune police à télécharger, donc
plus rien à attendre avant le premier rendu.

### Les cibles tactiles passent de 32 à 44 points

Mesurées sur simulateur, les commandes de la liste faisaient 32 points, et les
bascules de langue et de thème 15 et 20. Apple demande 44. À noter : la
propriété `hitSlop` de React Native agrandit la zone du doigt mais pas le cadre
exposé au système, donc VoiceOver continuait d'annoncer des cibles de 15 points.
Les éléments ont été agrandis pour de vrai.

### Le filtre par type accepte deux types, combinés en ET

La maquette ne retient qu'un type à la fois. La feuille en accepte deux : un
Pokémon doit alors porter les deux pour rester dans la liste. La limite vient du
domaine et non de l'interface, puisqu'une espèce n'a jamais plus de deux types,
et qu'une troisième case cochée ne pourrait plus rien renvoyer.

Les 18 types tiennent dans la feuille d'un seul coup d'oeil, triés dans la
langue affichée plutôt que dans l'ordre alphabétique de leurs identifiants
anglais, qui paraît aléatoire en français. Le filtre s'applique dès l'appui,
sans bouton de validation, et les types retenus restent affichés sous la
recherche avec le nombre de résultats : fermée, la feuille ne cache aucun état.
La grille garde ainsi toute sa hauteur tant qu'aucun filtre n'est posé. Le voile
et la feuille sont animés séparément, plus lentement à l'ouverture qu'à la
fermeture, et l'animation respecte le réglage « Réduire les animations ».

### Le numéro de l'espèce remplace la Pokéball en filigrane

La fiche portait une Pokéball géante en fond, qui ne dit rien et concurrence
l'artwork sur les types clairs. Elle laisse la place au numéro de l'espèce, en
creux derrière le visuel. Dans un Pokédex, le numéro est l'identité de la
créature. Par symétrie, sur les cartes de la liste, le numéro passe sous le nom
et s'efface : c'est le nom qu'on cherche dans une grille.

### La surface blanche descend jusqu'au bas de l'écran

La maquette l'encadre de rouge sur ses quatre côtés. Sur un iPhone, ce liseré de
quatre points passe derrière les coins arrondis de l'écran et paraît accidentel.

## Tests

```bash
npm test            # tests unitaires
npx tsc --noEmit    # vérification des types
npx expo lint       # lint
```
