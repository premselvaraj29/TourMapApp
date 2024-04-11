import { Component, OnDestroy, OnInit } from '@angular/core';
import { find, flatten, isEqual, slice } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { MapService } from 'src/app/services/map.service';
import { PlacesService } from 'src/app/services/places.service';
import { RecommendationsService } from 'src/app/services/recommendations.service';
import { PlaceFilter } from 'src/app/shared/type';
import { Category } from 'src/app/shared/category';
import { filter, take } from 'rxjs';

type PlaceCategory = {
  label: string;
  selected: boolean;
  value: keyof typeof Category;
};

@Component({
  selector: 'app-places-container',
  templateUrl: './places-container.component.html',
  styleUrls: ['./places-container.component.css'],
})
export class PlacesContainerComponent implements OnInit, OnDestroy {
  recommendations: any[] = [];
  favorites: any[] = [];
  iconColor = {};
  options: Partial<PlaceFilter>;
  category: PlaceCategory[];
  filteredRecommendations: any[] = [];

  constructor(
    private recommendationsService: RecommendationsService,
    private cookieService: CookieService,
    private mapService: MapService,
    private placesService: PlacesService
  ) {
    this.options = {
      isOpenNow: false,
    };

    this.category = [
      {
        label: 'Restaurants',
        selected: false,
        value: 'restaurants',
      },
      {
        label: 'Parks',
        selected: false,
        value: 'parks',
      },
      {
        label: 'Cinemas',
        selected: false,
        value: 'arts',
      },
      {
        label: 'Others',
        selected: false,
        value: 'others',
      },
    ];
  }

  updateMap() {
    this.mapService.removeMarkers();
    this.mapService.addPlaces(this.filteredRecommendations);
    this.filteredRecommendations.forEach((place) => {
      this.iconColor[place.place_id] = 'grey';
    });
  }

  ngOnInit() {
    this.recommendationsService.onRecommendationsUpdate((data) => {
      console.log(data);

      this.recommendations = flatten(
        data.filter((x) => x.status === 'OK').map((x) => x.results)
      );
      this.recommendations = this.recommendations.filter((recommendation) => {
        return recommendation.business_status === 'OPERATIONAL';
      });
      this.filteredRecommendations = this.recommendations;
      this.updateMap();
    });

    if (this.cookieService.check('user_id')) {
      this.recommendationsService.requestRecommendations(this.options);
    }

    this.placesService.placeContainerTabSelection$
      .pipe(
        filter((a) => a === true),
        take(1)
      )
      .subscribe((_) => {
        console.log('Running placeContainerTabSelection$');

        if (this.filteredRecommendations.length > 0) {
          this.updateMap();
        }
      });
  }

  filterChanged(changedData: any) {
    const currentOptions = { ...this.options, ...changedData };
    if (isEqual(currentOptions, this.options) === true) {
      return;
    }
    this.options = currentOptions;
    if (this.cookieService.check('user_id')) {
      this.recommendationsService.requestRecommendations(this.options);
    }
  }

  ngOnDestroy() {
    this.recommendationsService.disconnect();
  }

  getPhotoUrl(place) {
    return this.mapService.getPhotoUrl(place);
  }

  toggleFavorite(place) {
    if (find(this.favorites, (x) => x.place_id === place.place_id)) {
      this.iconColor[place.place_id] = 'grey';
      this.favorites = this.favorites.filter(
        (x) => x.place_id !== place.place_id
      );
    } else {
      this.iconColor[place.place_id] = 'red';
      this.favorites.push(place);
    }
    this.placesService.favorites$.next(this.favorites);
  }

  getIconColor(place) {
    return this.iconColor[place.place_id];
  }

  getPrice(item: any) {
    const priceLevel = item['price_level'];

    if (!priceLevel) {
      return undefined;
    }
    const prices = ['$', '$$', '$$$', '$$$$'];
    return prices[priceLevel - 1];
  }

  getAddress(item: any) {
    const [address] = item['formatted_address'].split(',');
    return address;
  }

  isOpenNow(item: any) {
    if (!item.opening_hours) {
      return false;
    }
    return !!item.opening_hours.open_now;
  }

  updateCategory(index: number) {
    const currentValue = this.category[index];
    currentValue.selected = !currentValue.selected;
    this.category[index] = currentValue;
    this.filterCategory();
  }

  filterCategory() {
    const selectedCategory = this.category.filter((category, cIndex) => {
      return category.selected === true;
    });

    if (!selectedCategory.length) {
      this.filteredRecommendations = this.recommendations;
      console.log({ lastOne: this.filteredRecommendations.slice(-4) });
      this.updateMap();
      return;
    }

    const selectedTypes = this.category
      .filter((category) => category.selected)
      .flatMap((sCategory) => Category[sCategory.value]);

    this.filteredRecommendations = this.recommendations.filter(
      (recommendation) =>
        recommendation.types.some((type) => selectedTypes.includes(type))
    );
    this.updateMap();
  }

  showLocationMarker(place) {
    this.mapService.openMarker(place);
  }
}
