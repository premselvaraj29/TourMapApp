import { Component } from '@angular/core';
import { PlacesService } from '../services/places.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  constructor(private placeService: PlacesService) {}

  placeContainerSelected($event) {
    this.placeService.placeContainerTabSelection$.next(true);
  }

  itinarySelected($event) {
    this.placeService.placeContainerTabSelection$.next(false);
  }
}
