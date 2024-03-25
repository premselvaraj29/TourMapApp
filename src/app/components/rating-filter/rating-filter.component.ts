import { Component, EventEmitter, Output } from '@angular/core';
import { PlaceFilterEvent } from 'src/app/shared/type';

@Component({
  selector: 'app-rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.css', '../../shared/place-filter.css']
})
export class RatingFilterComponent {
  availableOptions = [
    ['Any Rating', false],
    ['2.0', 2.0],
    ['2.5', 2.5],
    ['3.0', 3.0],
    ['3.5', 3.5],
    ['4.0', 4.0],
    ['4.5', 4.5],
  ];
  selectedValue: boolean;
  defaultDisplayText: string = 'Rating'
  currentDisplayText: string;

  @Output() valueChanged = new EventEmitter<PlaceFilterEvent<'ratings'>>();

  constructor() {
    this.selectedValue = false;
    this.currentDisplayText = this.defaultDisplayText;
  }

  setValue(value: any) {
    const [displayText, currentValue] = value
    this.currentDisplayText = `${displayText}+`;
    const [, defaultValue] = this.availableOptions[0]
    if (currentValue === defaultValue) {
      this.currentDisplayText = this.defaultDisplayText;
    }
    this.selectedValue = currentValue;
    this.valueChanged.emit({ ratings: currentValue, isClientSide: true, type:'ratings' });
  }
}
