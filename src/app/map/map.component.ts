import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  map: google.maps.Map;
  constructor(private mapService: MapService) {}
  ngOnInit(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyCYYEd7y5K5e0kSPk-J39b2jO31qL7es1s',
      version: 'weekly',
    });
    this.mapService.createMap(document.getElementById('map') as HTMLElement);

    // loader.load().then(async () => {
    //   const { Map } = (await google.maps.importLibrary(
    //     'maps'
    //   )) as google.maps.MapsLibrary;
    //   // this.map = new Map(document.getElementById('map') as HTMLElement, {
    //   //   center: { lat: -34.397, lng: 150.644 },
    //   //   zoom: 8,
    //   // });

    // });
  }
}
