import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

import { FEATURE_NAME, reducers } from './examples.state';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent, BottomSheetComponent } from './examples/examples.component';

import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { CrudComponent } from './crud/components/crud.component';

import { ExamplesEffects } from './examples.effects';
import { JeuxEffects } from './authenticated/jeu.effects';
import { JeuServiceService } from './authenticated/jeu-service.service';
import { LogosEffects } from './crud/logos.effects';
import { GearsComponent } from './gears/gears.component';

import { SHARED_VISUALS } from './visuals/shared';
import { D3_DIRECTIVES, D3Service } from './d3';
import { GraphComponent } from './visuals/graph/graph.component';
import { VotesEffects } from './crud/vote.effects';
import { UsersInfoComponent } from './users-info/users-info.component';
import { UsersEffects } from './users-info/users.effects';
import { PixabayComponent } from './pixabay/pixabay.component';

import { VariableService } from './variable-component/variable.service';
import { FbService } from './fb-component/fb.service';

import { ReactiveFormsModule }          from '@angular/forms';
import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question/dynamic-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { QuestionControlService } from './questionnaire/question-service';
import { QuestionService } from './questionnaire/questions-service2';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { QuestionnaireEffects } from './questionnaire/questionnaire.effects';
import { TibbleComponent } from './tibble/tibble.component';
import { FileUploadServiceService } from './tibble/file-upload-service.service';

import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  imports: [
    MatChipsModule,
    MatPaginatorModule,
    MatTableModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    SharedModule,
    ExamplesRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      ExamplesEffects,
      JeuxEffects,
      LogosEffects,
      VotesEffects,
      UsersEffects,
      QuestionnaireEffects
    ])
  ],
  declarations: [
    BottomSheetComponent,
    DynamicFormQuestionComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    ExamplesComponent,
    CrudComponent,
    AuthenticatedComponent,
    GearsComponent,
    UsersInfoComponent,
    DynamicFormComponent,
    QuestionnaireComponent,
    TibbleComponent
  ],
  entryComponents: [BottomSheetComponent],
  providers: [JeuServiceService,QuestionControlService,QuestionService,],
  exports: [ DynamicFormComponent, QuestionnaireComponent]
})
export class ExamplesModule {
  constructor() {}
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}
