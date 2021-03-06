import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map, switchMap, take} from 'rxjs/operators';
import {of} from 'rxjs';

import {Recipe} from './recipes.model';

import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as RecipeAction from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>,
              private action$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(rcpState => {
        return rcpState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeAction.FetchRecipes());
          return this.action$.pipe(
            ofType(RecipeAction.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
