import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IconDefinition } from '@ant-design/icons-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { TextFormComponent } from './components/text-form/text-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapService } from './services/map.service';
import { TwitterConnectComponent } from './components/twitter-connect/twitter-connect.component';
import { TwitterService } from './services/twitter.service';
import { PlacesContainerComponent } from './components/places-container/places-container.component';
import { PlacesService } from './services/places.service';
import { RecommendationsService } from './services/recommendations.service';
import { ItinaryScheduleComponent } from './components/itinary-schedule/itinary-schedule.component';
import { PriceFilterComponent } from './components/price-filter/price-filter.component';
import { OpennowFilterComponent } from './components/opennow-filter/opennow-filter.component';
import { RatingFilterComponent } from './components/rating-filter/rating-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MapComponent,
    TextFormComponent,
    TwitterConnectComponent,
    PlacesContainerComponent,
    ItinaryScheduleComponent,
    PriceFilterComponent,
    OpennowFilterComponent,
    RatingFilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    MapService,
    TwitterService,
    RecommendationsService,
    PlacesService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
