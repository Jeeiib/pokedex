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
   est isolé dans `getArtworkUrl()`.
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

## Tests

```bash
npm test            # tests unitaires
npx tsc --noEmit    # vérification des types
npx expo lint       # lint
```
