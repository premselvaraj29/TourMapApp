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

type PlaceFilterEventsMap = {
  hours: { isOpenNow: boolean };
  ratings: { ratings: string };
  priceRange: { priceRange: { min: number } };
};

export type PlaceFilterEvent<Type extends keyof PlaceFilterEventsMap> = PlaceFilterEventsMap[Type] & { isClientSide: boolean, type: Type }
