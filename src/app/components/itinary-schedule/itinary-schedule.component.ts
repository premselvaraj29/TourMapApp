import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { filter, take } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-itinary-schedule',
  templateUrl: './itinary-schedule.component.html',
  styleUrls: ['./itinary-schedule.component.css'],
})
export class ItinaryScheduleComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private placesService: PlacesService,
    private mapService: MapService
  ) {}
  timeRequirementForm: FormGroup = this.fb.group({
    totalTime: new FormControl(0, Validators.required),
    timePerLocation: new FormControl(0, Validators.required),
  });

  optimizedRoutePlaces: any[] = [];
  ngOnInit(): void {
    this.placesService.optimizedFavorites$.subscribe((data) => {
      this.optimizedRoutePlaces = data.map((i) => ({
        ...i,
        name: i.name ? i.name : i.formatted_address,
      }));
    });

    this.placesService.placeContainerTabSelection$
      .pipe(
        filter((i) => i === false),
        take(1)
      )
      .subscribe((_) => {
        this.mapService.removeMarkers();
      });
  }

  submitForm() {
    this.placesService.getDistanceMatrix(
      this.timeRequirementForm.value.totalTime,
      this.timeRequirementForm.value.timePerLocation
    );
  }

  clickMe() {
    console.log('clicked');
  }
}
