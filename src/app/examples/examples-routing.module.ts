import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '@app/core';

import { ExamplesComponent } from './examples/examples.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { CrudComponent } from './crud/components/crud.component';

import { GearsComponent } from './gears/gears.component';
import { UsersInfoComponent } from './users-info/users-info.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { TibbleComponent } from './tibble/tibble.component';
const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'crud',
        pathMatch: 'full'
      },
      {
        path: 'crud',
        component: CrudComponent,
        data: { title: 'Liste de lecture' }
      },
      {
        path: 'crud/:id',
        component: CrudComponent,
        data: { title: 'Liste de lecture' }
      },
      {
        path: 'gears',
        component: GearsComponent,
        data: { title: 'Graph' }
      },
      {
        path: 'users-info',
        component: UsersInfoComponent,
        data: { title: 'Users' }
      },
      {
        path: 'questionnaire',
        component: QuestionnaireComponent,
        data: { title: 'Questionnaire' }
      },
      {
        path: 'tibble',
        component: TibbleComponent,
        data: { title: 'Tibble' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
