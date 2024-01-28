import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzButtonType } from 'ng-zorro-antd/button';
import { filter } from 'rxjs';
import { ITweet } from 'src/app/models/ITweet';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-text-form',
  templateUrl: './text-form.component.html',
  styleUrls: ['./text-form.component.css'],
})
export class TextFormComponent implements OnInit {
  inputForm: FormGroup<{
    tweet: FormControl<string>;
  }> = this.fb.group({
    tweet: ['', [Validators.required]],
  });

  buttonType: NzButtonType = null;

  submitForm(): void {
    //console.log('submit', this.inputForm.value);
    const tweets: ITweet[] = this.inputForm
      .get('tweet')
      .value.split(';')
      .map((x) => ({ text: x }));

    this.mapService.suggestPlaces(tweets);
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.inputForm
      .get('tweet')
      .valueChanges.pipe(filter((a) => a.length > 0))
      .subscribe((value) => {
        this.buttonType = 'primary';
      });
  }
}
