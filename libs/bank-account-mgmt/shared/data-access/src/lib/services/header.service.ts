import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { POP_LIST, IBankAccountHeaderContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { ContentFacade } from '../content';

@Injectable()
export class HeaderService {
  private readonly DEFAULT_URL: string = POP_LIST;
  private _headerSubject$: BehaviorSubject<IBankAccountHeaderContent> =
    new BehaviorSubject<IBankAccountHeaderContent>(null);

  constructor(private readonly _contentFacade: ContentFacade) {
    this.setHeaderLabel(this.DEFAULT_URL);
  }

  public getHeaderLabel(): Observable<IBankAccountHeaderContent> {
    return this._headerSubject$.asObservable();
  }

  public setHeaderLabel(route: string): void {
    this._contentFacade
      .getHeaderContent(this.getTranslateKey(route))
      .pipe(take(1))
      .subscribe((content: IBankAccountHeaderContent) => {
        this._headerSubject$.next(content);
      });
  }

  private getTranslateKey(route?: string): string {
    const formattedRoute: string = route.slice(1);
    switch (formattedRoute) {
      case POP_LIST:
        return 'bankAccountsHeader';
      default:
        return 'bankAccountsHeader';
    }
  }
}
