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

  markers: google.maps.Marker[] = [];

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

  addPlaces(places, map = this.map) {
    for (const place of places) {
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
        this.markers.push(marker);
        this.attachInfoWindow(marker, place);
      }
    }
  }

  removeMarkers() {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  getPhotoUrl(place: google.maps.places.PlaceResult) {
    let photoReference = null;
    if (place.photos !== undefined && place.photos.length !== 0) {
      //@ts-ignore
      photoReference = place.photos[0].photo_reference;
      const placeId = place.place_id;
      return `${this.url}places-images/${placeId}/${photoReference}`;
    }
    return 'assets/map-default.png';
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
    const placeId = placeResult.place_id;
    const photoUrl = `${this.url}places-images/${placeId}/${photoReference}`;
    let content = `<div> <h2>${placeResult.name}</h2>`;

    if (photoReference !== null) {
      content =
        content +
        `<img src="${photoUrl}" alt="${placeResult.name}" loading="lazy"> </div>`;
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

  addRoute(wayPointsWithoutStopOver: google.maps.places.PlaceResult[]) {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    const waypts = wayPointsWithoutStopOver
      .map((wayPoint, index) => {
        if (index !== 0 && index !== wayPointsWithoutStopOver.length - 1) {
          return {
            location: wayPoint.geometry.location,
            stopover: true,
          };
        } else {
          return { location: wayPoint.geometry.location, stopover: false };
        }
      })
      .filter((a) => a !== null);
    // const waypts = [
    //   {
    //     location: { lat: 35.2271, lng: -80.8431 }, // Example waypoint (Charlotte)
    //     stopover: true,
    //   },
    //   {
    //     location: { lat: 34.0522, lng: -118.2437 }, // Another example waypoint (Los Angeles)
    //     stopover: true,
    //   },
    // ];

    const request = {
      origin: waypts[0].location,
      destination: waypts[waypts.length - 1].location,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    console.log(request);

    const image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    };

    directionsService.route(request, (result, status) => {
      let marker = null;
      const firstLocation =
        result.routes[0].legs[result.routes[0].legs.length - 1].end_address;

      // marker = new google.maps.Marker({
      //   position: waypts[0].location,
      //   map: this.map,
      //   title: firstLocation,
      //   icon: image,
      // });

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        console.log(result);
        console.log('total length', result.routes[0].legs.length);
        const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let labelIndex = 1;
        // Add custom markers for each waypoint

        for (let i = 0; i < result.routes[0].legs.length; i++) {
          const leg = result.routes[0].legs[i];
          console.log(leg);

          if (i === result.routes[0].legs.length - 1) {
            marker = new google.maps.Marker({
              position: leg.end_location,
              map: this.map,
              title: leg.end_address,
              icon: image,
            });
            continue;
          }

          marker = new google.maps.Marker({
            position: leg.end_location,
            map: this.map,
            title: leg.end_address,
          });
        }
      }
    });
  }
}
// label: `${index + 1}`,
//waypts.slice(1, -1),
