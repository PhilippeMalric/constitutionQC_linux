import { v4 as uuid } from 'uuid';
import { Store, select } from '@ngrx/store';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { routeAnimations, selectAuth, selectEmail } from '@app/core';
import { State as BaseSettingsState } from '@app/settings';

import { State as BaseExamplesState } from '../examples.state';
import { DataService } from '../gears/data.service';
import { Logo } from '../crud/logos.model';

import { Jeu, JeuState } from '../authenticated/jeu.model';

import { Logos_KEY } from '../../examples/crud/logos.effects';
import { ActionLogosUpsertAll, ActionLogosSaveONE } from '../crud/logos.actions';
import {
  ActionJeuUpsertOneCarte,
  ActionJeuUpsertAllCartesFromFirebase
} from '../authenticated/jeu.actions';
import { ActionVoteUpsertAll } from '../crud/vote.actions';
import { AngularFireDatabase } from 'angularfire2/database';
import { Action } from 'rxjs/internal/scheduler/Action';
import { SaveUsers } from '../users-info/users.actions';
import { User } from '../users-info/users.model';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

interface State extends BaseSettingsState, BaseExamplesState {}

@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations]
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;


  entitiesLogo$: Observable<any[]>;
  subscription: Subscription;
  subscription2: Subscription;

  examplesNonAdmin  = [
    { link: 'crud', label: 'Liste des items', auth: false,admin:false  },
    { link: 'tibble', label: 'Tibble', auth: false,admin:false  },
    { link: 'users-info', label: 'Liste des utilisateurs', auth: false,admin:false  }
  ];


  examplesAdmin  = [
    { link: 'pixbay', label: 'PixaBay', auth: false,admin:true  },
    { link: 'fb-comments', label: 'Facebook', auth: false,admin:true  },
    { link: 'variables', label: 'Variables', auth: false,admin:true  },
    { link: 'questionnaire', label: 'Questionnaire', auth: false,admin:true }
  ];


  elements = ['La vie est belle', 'Keven est un homme inteligent', 'etc.'];

  key: string = Logos_KEY;
  votes$: Observable<any>;
  authName$: Observable<any>;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<State>,
    private dataS: DataService,
    private db: AngularFireDatabase
  ) {
    this.authName$ = this.store.pipe(select(selectEmail));
    const path = 'users/';

    this.db.object(path).valueChanges().subscribe((data)=>{

      console.log("data!!!")
      console.log(data)
      let users = Object.keys(data).map((k)=>new User(k,data[k].status,"https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png",data[k].dp))
      this.store.dispatch(new SaveUsers({users:users}))
    });
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }

    this.votes$ = this.dataS.fireStoreVotes();
    this.subscription2 = this.votes$.subscribe((votes: any) => {
      console.log("fireStoreVotes")
      console.log(votes)
      this.store.dispatch(
        new ActionVoteUpsertAll({ votes: votes })
      );
    });

    this.subscription = null;
    this.changeEntityLogo();

    //Pour avoir sa propre list d'items
    /*
    const inter1 = setInterval(() => {
      if (dataS.logoKey) {
        dataS.logoKey.subscribe(key => {
          //console.log('key');
          //console.log(key);
          this.key = key;
          this.changeEntityLogo();
        });
        clearInterval(inter1);
      }
    }, 1000);
    */
  }

  click() {
    console.log('test1');
  }

  changeEntityLogo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.entitiesLogo$ = this.dataS.fireStoreLogoObs(this.key);
    this.subscription = this.entitiesLogo$.subscribe((logos: Logo[]) => {
      //console.log('new fireStoreObservable logos');
      //console.log(logos);
      this.store.dispatch(new ActionLogosUpsertAll({ logos: logos }));
    });

    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(
      select(selectAuth),
      map(auth => auth.isAuthenticated)
    );
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

}



@Component({
  selector: 'bottom-sheet-sheet',
  templateUrl: 'bottom-sheet.html',
})
export class BottomSheetComponent {

  logoFormGroup = this.fb.group(BottomSheetComponent.createLogo());
  static createLogo(): Logo {
    return {
      id: uuid(),
      texte: '-',
      url_img: '-',
      niveauDaccord: 0,
      commentaire: '',
      x: 200,
      y: 200
    };
  }


  constructor(
    private router: Router,
    public store: Store<State>,
    public fb: FormBuilder,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }





save() {
  if (this.logoFormGroup.valid) {
    console.log("save")
    const logo = this.logoFormGroup.value;
    this.store.dispatch(new ActionLogosSaveONE({ logo: logo }));

    this.router.navigate(['app','crud']);
    this._bottomSheetRef.dismiss()
  }
}

}
