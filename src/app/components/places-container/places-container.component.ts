import { Component, OnDestroy, OnInit } from '@angular/core';
import { find, flatten, isEqual } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { MapService } from 'src/app/services/map.service';
import { PlacesService } from 'src/app/services/places.service';
import { RecommendationsService } from 'src/app/services/recommendations.service';
import { PlaceFilter } from 'src/app/shared/type';

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
  constructor(
    private recommendationsService: RecommendationsService,
    private cookieService: CookieService,
    private mapService: MapService,
    private placesService: PlacesService
  ) {
    this.options = {
      isOpenNow: false
    }
  }

  ngOnInit() {
    this.recommendationsService.onRecommendationsUpdate((data) => {
      console.log(data);

      this.recommendations = flatten(
        data.filter((x) => x.status === 'OK').map((x) => x.results)
      );
      this.mapService.addPlaces(this.recommendations);
      this.recommendations.forEach((place) => {
        this.iconColor[place.place_id] = 'grey';
      });
    });

    if (this.cookieService.check('user_id')) {
      this.recommendationsService.requestRecommendations(this.options);
    }
  }

  filterChanged(changedData: any) {
    const currentOptions = {...this.options, ...changedData};
    if(isEqual(currentOptions, this.options) === true) {
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
}
