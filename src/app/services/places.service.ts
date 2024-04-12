import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, filter, switchMap, take, tap } from 'rxjs';
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
  pythonUrl = 'http://127.0.0.1:5000/';
  currentLocationLatLng: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  readonly apiKey = 'AIzaSyCCkpYBmmRu-LhbQAgr5wwqPenACImYDVM';
  currentLocation$ = new Subject<google.maps.places.PlaceResult>();
  placeContainerTabSelection$ = new Subject<boolean>();
  time_matrix = [];
  optimalRoutes = [];

  constructor(private http: HttpClient, private mapService: MapService) {}

  getFavorites() {
    return this.favorites$.getValue();
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.currentLocationLatLng = location;
      this.http
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${this.apiKey}`
        )
        .subscribe((data) => {
          this.currentLocation$.next(data['results'][0]);
        });
    });
  }

  getDistanceMatrix(total_time_required: number, time_to_spend: number) {
    this.getCurrentLocation();

    this.currentLocation$
      .pipe(
        filter((a) => a !== undefined && a !== null),
        take(1)
      )
      .subscribe((currentLocation) => {
        const favorites = [currentLocation, ...this.getFavorites()];
        const origins = favorites
          .map((favorite) => favorite.geometry.location)
          .map((location) => [location['lat'], location['lng']]);

        this.http
          .post(this.url + 'distance-matrix', { data: origins })
          .pipe(
            tap((res) => {
              this.time_matrix = res['time_matrix'];
              console.log(this.time_matrix);
            }),
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
            this.optimalRoutes = optimalRoutes;

            const optimizedFavorites = optimalRoutes.map(
              (index) => favorites[index]
            );
            console.log(optimizedFavorites);

            this.optimizedFavorites$.next(optimizedFavorites);
            this.mapService.addRoute(optimizedFavorites);
          });
      });
  }
}
