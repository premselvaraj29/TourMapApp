import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITweet } from '../models/ITweet';
import { flatten } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class MapService {
  url = 'http://localhost:3000/';
  placeService: google.maps.places.PlacesService;
  map: google.maps.Map;
  private pyrmont = new google.maps.LatLng(
    45.49668500000002,
    -73.57755583068695
  );
  constructor(private http: HttpClient) {}

  suggestPlaces(tweets: ITweet[]) {
    this.http
      .post(this.url + 'natural-language', { data: tweets })
      .subscribe((res: any[]) => {
        const results = res.map((x) => x.results);
        this.addPlaces(flatten(results), this.map);
      });
  }

  createMap(mapDiv: HTMLElement) {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 45.49668500000002, lng: -73.57755583068695 },
      zoom: 12,
    };
    this.map = new google.maps.Map(mapDiv, mapOptions);
  }

  createPlaceService(map: google.maps.Map) {
    this.placeService = new google.maps.places.PlacesService(map);
  }

  addPlaces(places, map) {
    for (const place of places) {
      console.log(place);

      if (place.geometry && place.geometry.location) {
        const image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        const marker = new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
        });

        this.attachInfoWindow(marker, place);
      }
    }
  }

  attachInfoWindow(
    marker: google.maps.Marker,
    placeResult: google.maps.places.PlaceResult
  ) {
    let photoReference = null;
    if (placeResult.photos !== undefined && placeResult.photos.length !== 0) {
      //@ts-ignore
      photoReference = placeResult.photos[0].photo_reference;
    }
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photo_reference=${photoReference}&key=AIzaSyCYYEd7y5K5e0kSPk-J39b2jO31qL7es1s`;
    let content = `<div> <h2>${placeResult.name}</h2>`;

    if (photoReference !== null) {
      content =
        content + `<img src="${photoUrl}" alt="${placeResult.name}"> </div>`;
    } else {
      content = content + `</div>`;
    }

    const infowindow = new google.maps.InfoWindow({
      content: content,
    });

    marker.addListener('click', () => {
      infowindow.open(marker.get('map'), marker);
    });
  }
}
