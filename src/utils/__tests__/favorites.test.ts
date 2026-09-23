// Vérifie que la liste des favoris s'ajoute et se retire sans mutation ni
// doublon, et que son stockage se relit même mal formé.

import { parseFavorites, toggleFavorite } from "@/utils/favorites";

describe("toggleFavorite", () => {
  it("adds an id that is absent", () => {
    expect(toggleFavorite([], 25)).toEqual([25]);
    expect(toggleFavorite([1, 4], 25)).toEqual([1, 4, 25]);
  });

  it("removes an id that is present", () => {
    expect(toggleFavorite([1, 25, 4], 25)).toEqual([1, 4]);
  });

  it("does not mutate the input list", () => {
    const list = [1, 4];
    toggleFavorite(list, 25);
    expect(list).toEqual([1, 4]);
  });

  it("never stores a duplicate", () => {
    expect(toggleFavorite(toggleFavorite([], 25), 25)).toEqual([]);
  });
});

describe("parseFavorites", () => {
  it("reads a stored list", () => {
    expect(parseFavorites("[1,4,25]")).toEqual([1, 4, 25]);
  });

  it("returns an empty list when nothing is stored", () => {
    expect(parseFavorites(null)).toEqual([]);
  });

  it("returns an empty list on malformed content", () => {
    expect(parseFavorites("not json")).toEqual([]);
    expect(parseFavorites('{"id":1}')).toEqual([]);
  });

  it("drops entries that are not numbers", () => {
    expect(parseFavorites('[1,"x",null,4]')).toEqual([1, 4]);
  });
});
