import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css', '../../shared/place-filter.css']
})
export class PriceFilterComponent {
  availableOptions = [
    ['Any Price', 0],
    ['$', 1],
    ['$$', 2],
    ['$$$', 3],
    ['$$$$', 4],
  ];
  selectedValue: number;
  defaultDisplayText: string = 'Price'
  currentDisplayText: string;

  @Output() valueChanged = new EventEmitter<{ priceRange: { min: number } }>();

  constructor() {
    this.selectedValue = 0;
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
    this.valueChanged.emit({ priceRange: { min: currentValue } });
  }
}
