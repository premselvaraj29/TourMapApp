import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-opennow-filter',
  templateUrl: './opennow-filter.component.html',
  styleUrls: ['./opennow-filter.component.css', '../../shared/place-filter.css']
})
export class OpennowFilterComponent {
  availableOptions = [
    ['Any Time', false],
    ['Open Now', true],
  ];
  selectedValue: boolean;
  defaultDisplayText: string = 'Hours'
  currentDisplayText: string;

  @Output() valueChanged = new EventEmitter<{ isOpenNow: boolean }>();

  constructor() {
    this.selectedValue = undefined;
    this.currentDisplayText = this.defaultDisplayText;
  }

  setValue(value: any) {
    const [displayText, currentValue] = value
    this.currentDisplayText = displayText;
    const [, defaultValue] = this.availableOptions[0]
    if (currentValue === defaultValue) {
      this.currentDisplayText = this.defaultDisplayText;
    }
    this.selectedValue = currentValue;
    this.valueChanged.emit({ isOpenNow: currentValue });
  }
}
