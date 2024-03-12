export type PlacePriceRange = 0 | 1 | 2 | 3 | 4;

export type PlaceFilter = {
  isOpenNow: boolean
  priceRange: Partial<{
    min: PlacePriceRange,
    max: PlacePriceRange
  }>,
  location: [number, number],
  ratings: number,
}
