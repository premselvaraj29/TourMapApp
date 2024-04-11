import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITweet } from '../models/ITweet';
import { flatten } from 'lodash';
class PlaceMarker extends google.maps.Marker {
  place_id?: string;
}

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

  markers: PlaceMarker[] = [];
  selectedMarker: PlaceMarker | null = null;
  infoWindow: google.maps.InfoWindow | null = null;

  infoWindows: google.maps.InfoWindow[] = [];

  constructor(private http: HttpClient) {}

  openMarker(place: google.maps.places.PlaceResult) {
    // If an info window is currently open, close it
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    const place_id = place.place_id;
    // If a marker is currently selected, reset its size
    if (this.selectedMarker) {
      const icon = this.selectedMarker.getIcon();
      if (typeof icon !== 'string') {
        //@ts-ignore
        icon.scaledSize = new google.maps.Size(25, 25); // Reset to original size //! This is the line that is causing the error
        this.selectedMarker.setIcon(icon);
      }
    }

    // Find the marker with the matching place_id
    const marker = this.markers.find((m) => m.place_id === place_id);

    if (marker) {
      // Enlarge the marker by changing the icon size
      const icon = marker.getIcon();
      if (typeof icon !== 'string') {
        //@ts-ignore
        icon.scaledSize = new google.maps.Size(50, 50); // Change the size as needed !this is the line causing the error
        marker.setIcon(icon);
      }

      // Open the info window
      google.maps.event.trigger(marker, 'click');

      // Set this marker as the currently selected marker
      this.selectedMarker = marker;

      // Assuming you have a method getMarkerInfoWindow that returns the info window for a marker
      this.infoWindow = this.attachInfoWindow(marker, place);
    }
  }

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
      center: { lat: 45.49668500000002, lng: -73.57755583068695 }, // Default center
      zoom: 12, // Default zoom level
    };
    this.map = new google.maps.Map(mapDiv, mapOptions);

    // Try to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If successful, set the center of the map and zoom level to the user's location
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map.setCenter(pos);
          this.map.setZoom(15); // Adjust zoom level as needed

          // Add a temporary marker at the current location
          new google.maps.Marker({
            position: pos,
            map: this.map,
            title: 'My Location',
          });
        },
        () => {
          // If the user denies the Geolocation request or it fails for some other reason, handle it here
          this.handleLocationError(true, this.map.getCenter());
        }
      );
    } else {
      // If the browser doesn't support Geolocation, handle it here
      this.handleLocationError(false, this.map.getCenter());
    }
  }
  handleLocationError(
    browserHasGeolocation: boolean,
    pos: google.maps.LatLng | null
  ) {
    console.error('Geolocation error has happened');
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

        const marker = new PlaceMarker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
        });
        marker.place_id = place.place_id;
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
  ): google.maps.InfoWindow {
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
      console.log('Running');
      this.infoWindows.forEach((infoWindow) => infoWindow.close());
      infowindow.open(marker.get('map'), marker);
    });

    this.infoWindows.push(infowindow);

    return infowindow;
  }

  addRoute(wayPointsWithoutStopOver: google.maps.places.PlaceResult[]) {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    const directionsService = new google.maps.DirectionsService();
    // Define the arrow symbol
    const arrow = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4,
      strokeColor: 'black', // A classic purple color
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: 'black', // Same as stroke color for a solid arrow
      fillOpacity: 1,
    };

    const directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map,
      polylineOptions: {
        strokeColor: 'blue',
        strokeOpacity: 0.6,
        strokeWeight: 4,
        icons: [
          {
            icon: arrow,
            offset: '100%',
            repeat: '100px', // Adjust so the arrows are not too crowded
          },
        ],
      },
    });

    // directionsDisplay.setMap(this.map);
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
            // marker = new google.maps.Marker({
            //   position: leg.end_location,
            //   map: this.map,
            //   title: leg.end_address,
            //   icon: image,
            // });
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
