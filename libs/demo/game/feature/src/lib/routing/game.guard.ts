import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { GameFacade } from '@ui-coe/demo/shared/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameGuard {
  constructor(private gameFacade: GameFacade) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.gameFacade.isGameLoaded$;
  }
}
