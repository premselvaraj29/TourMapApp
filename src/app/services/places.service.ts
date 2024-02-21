import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, take } from 'rxjs';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  favorites$: BehaviorSubject<google.maps.places.PlaceResult[]> =
    new BehaviorSubject([]);
  optimizedFavorites$: BehaviorSubject<google.maps.places.PlaceResult[]> =
    new BehaviorSubject([]);
  url = 'http://localhost:3000/';
  pythonUrl = 'http://localhost:5000/';
  constructor(private http: HttpClient, private mapService: MapService) {}

  getFavorites() {
    return this.favorites$.getValue();
  }

  getDistanceMatrix(total_time_required: number, time_to_spend: number) {
    const favorites = this.getFavorites();
    const origins = favorites
      .map((favorite) => favorite.geometry.location)
      .map((location) => [location['lat'], location['lng']]);

    this.http
      .post(this.url + 'distance-matrix', { data: origins })
      .pipe(
        switchMap((res) => {
          const data = { ...res, total_time_required, time_to_spend };
          return this.http.post(
            this.pythonUrl + 'calculate_optimal_tour',
            data
          );
        }),
        take(1) //It is providing results two times no time to debug now
      )
      .subscribe((data) => {
        const optimalRoutes = data['optimal_combined_tour'];
        const optimizedFavorites = optimalRoutes.map(
          (index) => favorites[index]
        );
        this.optimizedFavorites$.next(optimizedFavorites);
        this.mapService.addRoute(optimizedFavorites);
      });
  }
}
