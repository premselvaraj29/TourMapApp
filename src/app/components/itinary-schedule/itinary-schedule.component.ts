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
import { DateTime } from 'luxon';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-itinary-schedule',
  templateUrl: './itinary-schedule.component.html',
  styleUrls: ['./itinary-schedule.component.css'],
})
export class ItinaryScheduleComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private placesService: PlacesService,
    private mapService: MapService,
    private i18n: NzI18nService
  ) {}
  timeRequirementForm: FormGroup = this.fb.group({
    startTime: new FormControl(new Date(), Validators.required),
    endTime: new FormControl(new Date(), Validators.required),
    //totalTime: new FormControl(0, Validators.required),
    timePerLocation: new FormControl(0, Validators.required),
  });

  optimizedRoutePlaces: any[] = [];
  startTime: Date;
  endTime: Date;

  ngOnInit(): void {
    this.i18n.setLocale(en_US);
    this.placesService.optimizedFavorites$.subscribe((data) => {
      const time_matrix = this.placesService.time_matrix;
      const optimalRoutes = this.placesService.optimalRoutes;
      const getTimeBetweenTwoPlaces = () => {
        let timeSpentInEachLocation = new Array(
          this.placesService.favorites$.getValue().length
        ).fill(this.timeRequirementForm.value.timePerLocation);

        timeSpentInEachLocation = [0, ...timeSpentInEachLocation];

        let timeArray: DateTime[] = [
          DateTime.fromJSDate(this.timeRequirementForm.value.startTime),
        ];
        for (let i = 1; i < optimalRoutes.length; i++) {
          const element = optimalRoutes[i];
          let timeTravel = time_matrix[optimalRoutes[i - 1]][optimalRoutes[i]];
          let timeSpent = timeSpentInEachLocation[i - 1];
          timeArray.push(
            timeArray[i - 1].plus({ minutes: timeTravel + timeSpent })
          );
        }
        console.log('Time Array', time_matrix);
        console.log('Optimal Routes', optimalRoutes);
        return timeArray;
      };
      let timeLabels = getTimeBetweenTwoPlaces();
      // DateTime.fromJSDate(this.timeRequirementForm.value.startTime),
      timeLabels = [...timeLabels];
      //@ts-ignore
      timeLabels = timeLabels.map((i) => i.toFormat('hh:mm a'));
      console.log(timeLabels);

      this.optimizedRoutePlaces = data.map((i, index) => ({
        ...i,
        name: i.name ? i.name : i.formatted_address,
        time: timeLabels[index],
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

  calculateTotalTimeInMinsBetweenTwoTimeStamps(
    startTime: Date,
    endTime: Date
  ): number {
    let startDateTime = DateTime.fromJSDate(startTime);
    let endDateTime = DateTime.fromJSDate(endTime);

    if (endDateTime > startDateTime) {
      console.log(
        'Difference in time',
        endDateTime.diff(startDateTime, 'minutes').minutes
      );

      return endDateTime.diff(startDateTime, 'minutes').minutes;
    } else {
      endDateTime.plus({ days: 1 });
      console.log(
        'Difference in time',
        endDateTime.diff(startDateTime, 'minutes').minutes
      );
      return endDateTime.diff(startDateTime, 'minutes').minutes;
    }
  }

  submitForm() {
    this.placesService.getDistanceMatrix(
      this.calculateTotalTimeInMinsBetweenTwoTimeStamps(
        this.timeRequirementForm.value.startTime,
        this.timeRequirementForm.value.endTime
      ),
      this.timeRequirementForm.value.timePerLocation
    );
  }

  clickMe() {
    console.log('clicked');
  }
}
