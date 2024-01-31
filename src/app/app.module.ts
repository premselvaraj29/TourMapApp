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
import { ReactiveFormsModule } from '@angular/forms';
import { MapService } from './services/map.service';
import { TwitterConnectComponent } from './components/twitter-connect/twitter-connect.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MapComponent,
    TextFormComponent,
    TwitterConnectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [MapService],
  bootstrap: [AppComponent],
})
export class AppModule { }
