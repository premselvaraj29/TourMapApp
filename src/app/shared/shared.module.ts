import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzCardModule,
    NzRateModule,
    NzTabsModule,
    NzTimelineModule,
    NzDropDownModule,
    NzRadioModule,
    NzTimePickerModule,
  ],
  exports: [
    NzLayoutModule,
    HttpClientModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzCardModule,
    NzRateModule,
    NzTabsModule,
    NzTimelineModule,
    NzDropDownModule,
    NzRadioModule,
    NzTimePickerModule,
  ],
  providers: [],
})
export class SharedModule {}
